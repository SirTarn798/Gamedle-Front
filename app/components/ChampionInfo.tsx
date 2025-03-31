"use client";

import { useState, useRef, ChangeEvent } from "react";
import { champion, ChampionWithPictures, lane, UpdateChampPayload } from "@/lib/type";
import { updateChampion } from "../(admin)/admin/champions/[championId]/edit/action";
import { toast } from "react-toastify";

interface ChampionInfoProps {
  champ: ChampionWithPictures;
}

interface ImageChanges {
  added: File[];
  deleted: string[]; // Using picture IDs instead of URLs
  icon?: File;
}

export default function ChampionInfo({ champ }: ChampionInfoProps) {
  // Initialize editedChamp with properly mapped values from champ
  const [isEditing, setIsEditing] = useState(false);
  const [editedChamp, setEditedChamp] = useState<champion>({
    ...champ,
    title: champ.title || "", // Using title instead of nick_name
    roles: [...champ.roles], // Using roles instead of role
    release_date: new Date(champ.release_date),
    icon_url: champ.icon_url || "" // Using icon_url instead of icon
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Track image changes
  const [imageChanges, setImageChanges] = useState<ImageChanges>({
    added: [],
    deleted: [],
  });

  // Track picturePreviewUrls separately from the actual picture objects
  const [picturePreviewUrls, setPicturePreviewUrls] = useState<string[]>(
    champ.pictures.map(pic => 
      pic.location.startsWith('http') ? pic.location : `/${pic.location}`
    )
  );

  // Refs for file inputs
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const pictureFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "release_date") {
      // Handle date
      setEditedChamp({
        ...editedChamp,
        [name]: new Date(value),
      });
    } else {
      // Handle other fields
      setEditedChamp({
        ...editedChamp,
        [name]: value,
      } as any);
    }
  };

  const handleRoleChange = (role: lane) => {
    if (editedChamp.roles.includes(role)) {
      setEditedChamp({
        ...editedChamp,
        roles: editedChamp.roles.filter((r) => r !== role),
      });
    } else {
      setEditedChamp({
        ...editedChamp,
        roles: [...editedChamp.roles, role],
      });
    }
  };

  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Track icon change
      setImageChanges((prev) => ({
        ...prev,
        icon: file,
      }));

      // Create a URL for the uploaded file
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedChamp({
          ...editedChamp,
          icon_url: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPictureFiles = Array.from(files);

      // Update imageChanges with added files
      setImageChanges((prev) => ({
        ...prev,
        added: [...prev.added, ...newPictureFiles],
      }));

      // Convert to preview URLs and add them to picturePreviewUrls
      newPictureFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPicturePreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeletePicture = (index: number) => {
    // Remove from preview URLs
    setPicturePreviewUrls(prev => 
      prev.filter((_, i) => i !== index)
    );

    // If it's an existing picture, add its ID to the deleted list
    if (index < champ.pictures.length) {
      const pictureToDelete = champ.pictures[index].location;
      setImageChanges(prev => ({
        ...prev,
        deleted: [...prev.deleted, pictureToDelete]
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    
    if(
      editedChamp.name === "" || 
      editedChamp.title === "" || 
      editedChamp.class === "" || 
      editedChamp.region === "" || 
      editedChamp.roles.length === 0 || 
      editedChamp.resource_type === ""
    ) {
      toast.error("Please validate each elements in form.");
      setIsSaving(false);
      return;
    }
    
    const formData = new FormData();
    
    // Add champion data
    formData.append("editedChamp", JSON.stringify(editedChamp));
    formData.append("championName", champ.name);

    // Add icon if changed
    if (imageChanges.icon) {
      formData.append("icon", imageChanges.icon);
    }

    // Add new pictures
    imageChanges.added.forEach((file) => {
      formData.append("addedPictures", file);
    });

    // Add deleted picture IDs
    imageChanges.deleted.forEach((id) => {
      formData.append("deletedPictures", id.toString());
    });

    try {
      const result = await updateChampion(formData);

      // Reset state after successful save
      setIsEditing(false);
      setImageChanges({
        added: [],
        deleted: [],
      });

      // Set success status
      setSaveStatus("success");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Failed to update champion", error);

      // Set error status
      setSaveStatus("error");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert to original state
    setIsEditing(false);
    setEditedChamp({
      ...champ,
      title: champ.title || "",
      roles: [...champ.roles],
      release_date: new Date(champ.release_date),
      icon_url: champ.icon_url || ""
    });
    setPicturePreviewUrls(
      champ.pictures.map(pic => 
        pic.location.startsWith('http') ? pic.location : `/${pic.location}`
      )
    );
    setImageChanges({
      added: [],
      deleted: [],
    });
  };

  // Available lanes for the dropdown
  const lanes: lane[] = ["Middle", "Top", "Jungle", "Bottom", "Support"];

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
      {isSaving && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-700 p-6 rounded-lg flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Saving changes...</span>
          </div>
        </div>
      )}

      {saveStatus === "success" && (
        <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-2 z-50">
          Champion updated successfully!
        </div>
      )}
      {saveStatus === "error" && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
          Failed to update champion. Please try again.
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative group mr-4">
              <img
                src={isEditing ? editedChamp.icon_url : champ.icon_url}
                alt={champ.name}
                className="w-24 h-24 rounded-full border-2 border-yellow-500 group-hover:opacity-50 transition-opacity"
              />
              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={iconFileInputRef}
                    onChange={handleIconUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => iconFileInputRef.current?.click()}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Change
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col">
              {isEditing ? (
                <div>
                  <input
                    name="name"
                    value={editedChamp.name}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-2xl font-normal mb-1"
                  />
                  <p
                    className={`${
                      editedChamp.name === "" ? "" : "hidden"
                    } text-cancelRed `}
                  >
                    Please insert champion's name
                  </p>
                </div>
              ) : (
                <h2 className="text-2xl font-normal">{champ.name}</h2>
              )}
              {isEditing ? (
                <div>
                  <input
                    name="title"
                    value={editedChamp.title}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-sm italic"
                  />
                  <p
                    className={`${
                      editedChamp.title === "" ? "" : "hidden"
                    } text-cancelRed `}
                  >
                    Please insert champion's title
                  </p>
                </div>
              ) : (
                <p className="text-sm italic text-gray-300">
                  {champ.title}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md font-medium ${
              isSaving
                ? "bg-gray-500 cursor-not-allowed"
                : isEditing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm">Region</label>
              {isEditing ? (
                <div>
                  <input
                    name="region"
                    value={editedChamp.region}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${
                      editedChamp.region === "" ? "" : "hidden"
                    } text-cancelRed `}
                  >
                    Please insert champion's region
                  </p>
                </div>
              ) : (
                <p>{champ.region}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm">Class</label>
              {isEditing ? (
                <div>
                  <input
                    name="class"
                    value={editedChamp.class}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                      className={`${
                        editedChamp.class === "" ? "" : "hidden"
                      } text-cancelRed `}
                    >
                      Please insert champion's class
                    </p>
                </div>
              ) : (
                <p>{champ.class}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editedChamp.gender || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                >
                  <option value="">None</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="capitalize">{champ.gender || "None"}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Role</label>
              {isEditing ? (
                <div className="space-y-2">
                  {lanes.map((lane) => (
                    <div key={lane} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`role-${lane}`}
                        checked={editedChamp.roles.includes(lane)}
                        onChange={() => handleRoleChange(lane)}
                        className="mr-2"
                      />
                      <label htmlFor={`role-${lane}`} className="capitalize">
                        {lane}
                      </label>
                    </div>
                  ))}
                  <p
                    className={`${
                      editedChamp.roles.length === 0 ? "" : "hidden"
                    } text-cancelRed `}
                  >
                    Please insert champion's roles
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {champ.roles.map((role, index) => (
                    <span
                      key={index}
                      className="bg-blue-900 px-2 py-1 rounded text-xs capitalize"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm">Range Type</label>
              {isEditing ? (
                <select
                  name="range_type"
                  value={editedChamp.range_type}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                >
                  <option value="Melee">Melee</option>
                  <option value="Ranged">Ranged</option>
                </select>
              ) : (
                <p className="capitalize">{champ.range_type}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm">
                Resource Type
              </label>
              {isEditing ? (
                <div>
                  <input
                    name="resource_type"
                    value={editedChamp.resource_type}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                      className={`${
                        editedChamp.resource_type === "" ? "" : "hidden"
                      } text-cancelRed `}
                    >
                      Please insert champion's resource type
                    </p>
                </div>
              ) : (
                <p>{champ.resource_type}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-400 text-sm">Release Date</label>
          {isEditing ? (
            <input
              type="date"
              name="release_date"
              value={editedChamp.release_date.toISOString().split("T")[0]}
              onChange={handleInputChange}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          ) : (
            <p>{new Date(champ.release_date).toLocaleDateString()}</p>
          )}
        </div>
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold mr-4">Champion Images</h3>
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={pictureFileInputRef}
                  onChange={handlePictureUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => pictureFileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Upload Pictures
                </button>
              </>
            )}
          </div>

          {/* Picture Gallery Grid */}
          <div className="grid grid-cols-3 gap-4">
            {picturePreviewUrls.map((pictureUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={pictureUrl}
                  alt={`${champ.name} splash ${index}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => handleDeletePicture(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md mr-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}