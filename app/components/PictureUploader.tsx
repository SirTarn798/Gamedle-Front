"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { saveToDatabase, uploadImages } from "../(upload)/upload/action";
import { UploadPicture, UploadedUrls } from "@/lib/type";
import { capitalizeFirstLetter } from "@/lib/util";
import { toast } from "react-toastify";

interface ImageGroup {
  [id: string]: {
    files: File[];
    previews: string[];
  };
}


export default function PictureUploader(data: UploadPicture) {
  const [imageGroups, setImageGroups] = useState<ImageGroup>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [uploadedUrls, setUploadedUrls] = useState<UploadedUrls | null>(null);
  const [toggleInfo, setToggleInfo] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const topPageRef = useRef<HTMLDivElement>(null);
  const [folderUploadKey, setFolderUploadKey] = useState(0);
  const [allPokemons, setAllPokemons] = useState();
  const [allChampions, setAllChampions] = useState();

  useEffect(() => {
    const fetchValue = async () => {

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${data.type}s/get_all`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data2 = await response.json();
        if (data.type === "champion") {
          setAllChampions(data2);
        } else {
          setAllPokemons(data2);
        }
      } catch (err) {
        console.log(err)
      }
    };

    fetchValue();
  }, []);

  // Process when users select folders directly
  const handleFolderUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setFolderUploadKey((prev) => prev + 1);
    setMessage("");
    setUploadedUrls(null);

    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsLoading(true);

    // FileList is not an array, convert it
    const fileArray = Array.from(e.target.files);
    // Create groups based on folder structure
    const groups: ImageGroup = {};
    // Process each file
    for (const file of fileArray) {
      try {
        // Using webkitRelativePath to get the path structure
        const path = file.webkitRelativePath || "";
        const pathParts = path.split("/");
        // Skip files not in subfolders or not images
        if (
          pathParts.length < 2 ||
          !/\.(jpe?g|png|gif|webp)$/i.test(file.name)
        ) {
          continue;
        }

        // The first folder is the entity name (id)
        const id = pathParts[1];

        // Create group if it doesn't exist
        if (!groups[id]) {
          groups[id] = { files: [], previews: [] };
        }

        // Add the file to its group
        groups[id].files.push(file);

        // Generate and add the preview URL
        const previewUrl = URL.createObjectURL(file);
        groups[id].previews.push(previewUrl);
      } catch (error) {
        console.error("Error processing file:", file.name, error);
      }
    }

    if (Object.keys(groups).length === 0) {
      // If no groups were created, try to handle the case where webkitRelativePath doesn't work
      setMessage(
        "Folder structure not detected. Please use the 'Upload entity Folders' method below."
      );
    } else {
      if (data.file === "icon") {
        const moreThanOneFiles = Object.keys(groups)
          .filter((id) => groups[id].files.length > 1)
          .map((id) => id);
        if (moreThanOneFiles.length > 0) {
          toast.error(
            `Only one icon per champion : Error at ${moreThanOneFiles.toLocaleString()}`
          );
          setIsLoading(false);
          return;
        }
      }
      setImageGroups(groups);
    }

    setIsLoading(false);
  };

  // Handle manual folder selection - Modified to add images instead of replacing
  const handleentityFolderSelect = (
    entityName: string,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    // Create a new groups object with the existing groups
    const newGroups = { ...imageGroups };

    // Create the group if it doesn't exist
    if (!newGroups[entityName]) {
      newGroups[entityName] = { files: [], previews: [] };
    }

    if (data.file === "icon") {
      if (newGroups[entityName].files.length >= 1) {
        toast.error(`Only one icon per champion`);
        return;
      }
    }

    // Add each file to the entity's group (instead of replacing)
    Array.from(files).forEach((file) => {
      if (/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
        newGroups[entityName].files.push(file);
        newGroups[entityName].previews.push(URL.createObjectURL(file));
      }
    });

    setImageGroups(newGroups);
  };

  // Add a new entity input section
  const addentityInput = () => {
    const entityName = prompt(`Enter ${data.type} name:`);
    if (!entityName) return;

    // Create empty group for this entity if it doesn't exist
    if (!imageGroups[entityName]) {
      setImageGroups({
        ...imageGroups,
        [entityName]: { files: [], previews: [] },
      });
    }
  };

  const uploadToR2 = async () => {
    if (Object.keys(imageGroups).length === 0) {
      setMessage("No images to upload");
      return;
    }
    const missingNames =
      data.type === "champion"
        ? Object.keys(imageGroups).filter(nameA => !allChampions.data.some(champ => champ.name === nameA))
        : data.type === "pokemon"
          ? Object.keys(imageGroups).filter(nameA => !allPokemons.some(pokemon => pokemon.name === nameA))
          : [];

    if (missingNames.length > 0) {
      toast.error(`Wrong name: ${missingNames.join(", ")}`);
      return;
    }
    setIsLoading(true);
    setMessage("Uploading to Cloudflare R2...");

    try {
      // Create an object to store all URLs grouped by ID
      const urlsById: UploadedUrls = {};

      // Process each entity group
      for (const entityName of Object.keys(imageGroups)) {
        urlsById[entityName] = [];
        const files = imageGroups[entityName].files;

        // If we don't have actual files (from ZIP processing), skip
        if (files.length === 0 && imageGroups[entityName].previews.length > 0) {
          // We would handle server-side files differently
          continue;
        }

        // Upload each file in the group
        for (const file of files) {
          // Create form data for upload
          const formData = new FormData();
          formData.append("files", file); // Changed 'file' to 'files' to match server action
          formData.append("entityName", entityName);
          // Send to your API endpoint that handles R2 upload
          const response = await uploadImages(formData, data.type, data.file);

          if (!response.success) {
            // Fixed condition check
            throw new Error(`Failed to upload ${file.name}`);
          }

          // Store the URL in our URLs object
          if (response.urls && response.urls.length > 0) {
            urlsById[entityName].push(response.urls[0]);
          }

        }
      }
      setUploadedUrls(urlsById);
      await saveToDatabase(urlsById, data.type, data.file);
      setMessage(
        "Upload complete! URLs are available in the console and below."
      );
    } catch (error) {
      setMessage(
        `Error uploading: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs
  const resetUpload = () => {
    // Revoke all object URLs
    Object.values(imageGroups).forEach((group) => {
      group.previews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    });

    // Reset state
    setImageGroups({});
    setMessage("");
    setUploadedUrls(null);

    // Reset file inputs
    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }

    // Reset other file inputs
    document
      .querySelectorAll('input[type="file"]')
      .forEach((input: HTMLInputElement) => {
        input.value = "";
      });
  };

  // Remove a specific image from a entity group
  const removeImage = (entityId: string, imageIndex: number) => {
    const newGroups = { ...imageGroups };

    // If the group doesn't exist, return
    if (!newGroups[entityId]) return;

    // Revoke the object URL to prevent memory leaks
    const previewUrl = newGroups[entityId].previews[imageIndex];
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    // Remove the file and preview from their respective arrays
    newGroups[entityId].files.splice(imageIndex, 1);
    newGroups[entityId].previews.splice(imageIndex, 1);

    // Update state
    setImageGroups(newGroups);
  };

  // Remove a entity group
  const removeentityGroup = (entityId: string) => {
    const newGroups = { ...imageGroups };

    // Revoke object URLs for this group
    newGroups[entityId].previews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    // Remove the group
    delete newGroups[entityId];
    setImageGroups(newGroups);
  };

  // Get sorted entity IDs for display
  const getSortedentityIds = (): string[] => {
    return Object.keys(imageGroups).sort((a, b) => a.localeCompare(b));
  };

  // Jump to save button
  const jumpToSave = () => {
    saveButtonRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const jumpToTop = () => {
    topPageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative z-10 w-full flex flex-col items-center"
      ref={topPageRef}
    >
      {toggleInfo && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
          <div className="bg-gray-700 p-6 rounded-lg flex flex-col">
            <div className="w-full flex justify-between">
              <h1 className="text-3xl">How To Upload</h1>
              <p
                className="text-3xl cursor-pointer"
                onClick={() => setToggleInfo(false)}
              >
                X
              </p>
            </div>
            <ol className="list-decimal text-lg">
              <li>Create a folder</li>
              <li>
                Create subfolders named after {data.type} in your database
              </li>
              <li>Put picture of a {data.type} in their folder</li>
              <li>Hit save to database</li>
              <li>
                You can use method 2 to manually add {data.type} {data.file}{" "}
                folder
              </li>
            </ol>
            <p className="text-cancelRed">
              If there are anormaly folder name, the upload process will hault
              and you need to fix it.
            </p>
            {data.file === "icon" ? (
              <p className="text-cancelRed">
                One champion folder can only have one icon file.
              </p>
            ) : null}
            <p>
              You can find there example file here :{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={
                  data.file === "icon"
                    ? "https://github.com/SirTarn798/LOLChampIconDataset"
                    : data.type === "champion"
                      ? "https://github.com/SirTarn798/LOLChampPicDataset"
                      : "https://www.kaggle.com/datasets/hlrhegemony/pokemon-image-dataset"
                }
                className="text-blue-400"
              >
                Link for {data.type} {data.file} folder
              </a>
            </p>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
        <div className="flex gap-2 items-center">
          <h1
            className={`${data.type === "pokemon" ? "text-mainTheme" : "text-gray-300"
              } text-2xl my-6`}
          >
            {capitalizeFirstLetter(data.type)}{" "}
            {capitalizeFirstLetter(data.file)}s Upload
          </h1>
          <img
            src={data.type === "pokemon" ? "/infoMainTheme.png" : "/info.png"}
            className="w-4 h-4 cursor-pointer"
            onClick={() => setToggleInfo(true)}
          />
        </div>

        {/* Fixed position Jump to Save button */}
        <div className="flex gap-2 sticky top-4 z-20 flex justify-end mb-4">
          <button
            onClick={jumpToSave}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md shadow-lg"
            disabled={isLoading}
          >
            Jump to Save
          </button>
          <button
            onClick={jumpToTop}
            className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-md shadow-lg"
            disabled={isLoading}
          >
            Jump to top
          </button>
        </div>

        {/* Method 1: Folder Upload (may not work in all browsers) */}
        <div className="mb-8 p-4 border border-gray-700 rounded-lg">
          <h2 className="text-lg text-white mb-3">
            Method 1: Upload {capitalizeFirstLetter(data.type)} Folders
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFolderUpload}
              className="hidden"
              disabled={isLoading}
              id="uploadFolder"
              key={folderUploadKey}
            />
            <label
              htmlFor={`uploadFolder`}
              className="text-white mr-4 py-2 px-4 rounded-lg border-0 text-sm bg-blue-500 text-white hover:bg-blue-600"
            >
              Choose Folder
            </label>
            <p
              className={`${data.type === "pokemon" ? "text-mainTheme" : "text-gray-300"
                } text-sm italic`}
            >
              Select the folder containing all {data.type} folders
            </p>
          </div>
        </div>

        {/* Method 2: Manual entity Selection */}
        <div className="mb-8 p-4 border border-gray-700 rounded-lg">
          <h2 className="text-lg text-white mb-3">
            Method 2: Select {capitalizeFirstLetter(data.type)}{" "}
            {capitalizeFirstLetter(data.file)}s Manually
          </h2>

          {/* Add entity button moved to top */}
          <div className="mb-4">
            <button
              onClick={addentityInput}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
              disabled={isLoading}
            >
              + Add {capitalizeFirstLetter(data.type)}
            </button>
          </div>

          {/* Existing entity inputs - alphabetically sorted */}
          {getSortedentityIds().map((entityId) => (
            <div key={entityId} className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">{entityId}</h3>
                <button
                  onClick={() => removeentityGroup(entityId)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  disabled={isLoading}
                >
                  Remove
                </button>
              </div>

              <input
                type="file"
                multiple={data.file !== "icon"} // Only allow single file for icons
                accept="image/*"
                onChange={(e) =>
                  handleentityFolderSelect(entityId, e.target.files)
                }
                disabled={
                  isLoading ||
                  (data.file === "icon" &&
                    imageGroups[entityId].files.length === 1)
                }
                className="hidden"
                id={`file-input-${entityId}`}
              />
              <label
                htmlFor={`file-input-${entityId}`}
                className={`text-white mr-2 py-1 px-3 rounded-md border-0 text-sm bg-blue-600 text-white hover:bg-blue-700 ${data.file === "icon" &&
                  imageGroups[entityId].files.length === 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  }`}
              >
                Add Files
              </label>

              {imageGroups[entityId].previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imageGroups[entityId].previews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 bg-gray-900 rounded overflow-hidden group"
                    >
                      <img
                        src={preview}
                        alt={`${entityId} preview ${idx + 1}`}
                        className="object-contain w-full h-full"
                      />
                      <button
                        onClick={() => removeImage(entityId, idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upload actions */}
        <div id="save-section" className="flex gap-4 mt-6">
          <button
            ref={saveButtonRef}
            onClick={uploadToR2}
            className={`px-4 py-2 rounded-lg transition-all ${Object.keys(imageGroups).length > 0 && !isLoading
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
              }`}
            disabled={Object.keys(imageGroups).length === 0 || isLoading}
          >
            {isLoading ? "Processing..." : "Save to Database"}
          </button>

          {Object.keys(imageGroups).length > 0 && (
            <button
              onClick={resetUpload}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              disabled={isLoading}
            >
              Reset
            </button>
          )}
        </div>

        {/* Status message */}
        {message && (
          <p
            className={`mt-3 text-sm ${message.includes("Error")
              ? "text-red-300"
              : message.includes("No ") || message.includes("Please")
                ? "text-yellow-900"
                : "text-lime-400"
              }`}
          >
            {message}
          </p>
        )}

        {/* Display uploaded URLs */}
        {uploadedUrls && (
          <div className="mt-8 bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl text-white mb-4">Uploaded URLs</h2>
            <pre className="text-gray-300 text-xs overflow-auto max-h-40 p-2 bg-black/50 rounded">
              {JSON.stringify(uploadedUrls, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
