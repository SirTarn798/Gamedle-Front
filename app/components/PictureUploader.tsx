'use client'

import { useState, useRef, ChangeEvent } from "react";
import { uploadImages } from "../(upload)/upload/action";
import { UploadPicture } from "@/lib/type";
import { capitalizeFirstLetter } from "@/lib/util";

interface ImageGroup {
    [id: string]: {
        files: File[];
        previews: string[];
    }
}

interface UploadedUrls {
    [id: string]: {
        [filename: string]: string;
    }
}

export default function PictureUploader(data : UploadPicture) {
    const [imageGroups, setImageGroups] = useState<ImageGroup>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [uploadedUrls, setUploadedUrls] = useState<UploadedUrls | null>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const saveButtonRef = useRef<HTMLButtonElement>(null);
    const topPageRef = useRef<HTMLDivElement>(null);


    // Process when users select folders directly 
    const handleFolderUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
                const path = file.webkitRelativePath || '';
                const pathParts = path.split('/');
                // Skip files not in subfolders or not images
                if (pathParts.length < 2 || !/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
                    continue;
                }

                // The first folder is the entity name (id)
                const id = pathParts[1];
                console.log(id)
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
            setMessage("Folder structure not detected. Please use the 'Upload entity Folders' method below.");
        } else {
            setImageGroups(groups);
        }

        setIsLoading(false);
    };

    // Alternative method - handle ZIP file upload
    const handleZipUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        setMessage("");
        setUploadedUrls(null);

        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        if (!file.name.endsWith('.zip')) {
            setMessage("Please upload a ZIP file containing entity folders.");
            return;
        }

        setIsLoading(true);
        setMessage("Processing ZIP file...");

        try {
            // Create form data for the ZIP processing
            const formData = new FormData();
            formData.append('zipFile', file);

            // Send to your API endpoint that handles ZIP extraction
            const response = await fetch('/api/process-zip', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to process ZIP file`);
            }

            const result = await response.json();

            if (result.groups && Object.keys(result.groups).length > 0) {
                // Convert the result to our ImageGroup format
                const newGroups: ImageGroup = {};

                for (const [id, files] of Object.entries(result.groups)) {
                    if (Array.isArray(files)) {
                        newGroups[id] = {
                            files: [], // We don't have actual File objects from the server
                            previews: (files as string[]), // These would be temporary URLs to the extracted files
                        };
                    }
                }

                setImageGroups(newGroups);
                setMessage(`Successfully processed ${Object.keys(newGroups).length} entity folders.`);
            } else {
                setMessage("No valid entity folders found in the ZIP file.");
            }
        } catch (error) {
            setMessage(`Error processing ZIP: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error("ZIP processing error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle manual folder selection - Modified to add images instead of replacing
    const handleentityFolderSelect = (entityName: string, files: FileList | null) => {
        if (!files || files.length === 0) return;

        // Create a new groups object with the existing groups
        const newGroups = { ...imageGroups };

        // Create the group if it doesn't exist
        if (!newGroups[entityName]) {
            newGroups[entityName] = { files: [], previews: [] };
        }

        // Add each file to the entity's group (instead of replacing)
        Array.from(files).forEach(file => {
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
                [entityName]: { files: [], previews: [] }
            });
        }
    };

    const uploadToR2 = async () => {
        if (Object.keys(imageGroups).length === 0) {
            setMessage("No images to upload");
            return;
        }
        console.log(imageGroups)
        setIsLoading(true);
        setMessage("Uploading to Cloudflare R2...");
    
        try {
            // Create an object to store all URLs grouped by ID
            const urlsById: UploadedUrls = {};
    
            // Process each entity group
            for (const entityName of Object.keys(imageGroups)) {
                urlsById[entityName] = {};
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
                    formData.append('files', file); // Changed 'file' to 'files' to match server action
                    formData.append('entityName', entityName);
                    // Send to your API endpoint that handles R2 upload
                    const response = await uploadImages(formData, data.type, data.file);
    
                    if (!response.success) { // Fixed condition check
                        throw new Error(`Failed to upload ${file.name}`);
                    }
    
                    // Store the URL in our URLs object
                    if (response.urls && response.urls.length > 0) {
                        urlsById[entityName][file.name] = response.urls[0];
                    }
                    
                    console.log(response);
                }
            }
    
            setUploadedUrls(urlsById);
            setMessage("Upload complete! URLs are available in the console and below.");
            console.log("Uploaded URLs:", urlsById);
    
        } catch (error) {
            setMessage(`Error uploading: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error("Upload error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Clean up object URLs to prevent memory leaks
    const resetUpload = () => {
        // Revoke all object URLs
        Object.values(imageGroups).forEach(group => {
            group.previews.forEach(preview => {
                if (preview.startsWith('blob:')) {
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
            folderInputRef.current.value = '';
        }

        // Reset other file inputs
        document.querySelectorAll('input[type="file"]').forEach((input: HTMLInputElement) => {
            input.value = '';
        });
    };

    // Remove a specific image from a entity group
    const removeImage = (entityId: string, imageIndex: number) => {
        const newGroups = { ...imageGroups };

        // If the group doesn't exist, return
        if (!newGroups[entityId]) return;

        // Revoke the object URL to prevent memory leaks
        const previewUrl = newGroups[entityId].previews[imageIndex];
        if (previewUrl.startsWith('blob:')) {
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
        newGroups[entityId].previews.forEach(preview => {
            if (preview.startsWith('blob:')) {
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
        saveButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const jumpToTop = () => {
        topPageRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative z-10 w-full flex flex-col items-center" ref={topPageRef}>
            <div className="w-full max-w-4xl p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
                <h1 className="text-2xl mb-6 text-white">{capitalizeFirstLetter(data.type)} {capitalizeFirstLetter(data.file)}s Upload</h1>

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
                    <h2 className="text-lg text-white mb-3">Method 1: Upload {capitalizeFirstLetter(data.type)} Folders</h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <input
                            ref={folderInputRef}
                            type="file"
                            webkitdirectory="true"
                            directory="true"
                            multiple
                            onChange={handleFolderUpload}
                            className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                            disabled={isLoading}

                        />
                        <p className="text-gray-300 text-sm italic">Select the folder containing all {data.type} folders</p>
                    </div>
                </div>

                {/* Method 2: Manual entity Selection */}
                <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                    <h2 className="text-lg text-white mb-3">Method 2: Select {capitalizeFirstLetter(data.type)} {capitalizeFirstLetter(data.file)}s Manually</h2>

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
                                multiple
                                accept="image/*"
                                onChange={(e) => handleentityFolderSelect(entityId, e.target.files)}
                                disabled={isLoading}
                                className="hidden"
                                id={`file-input-${entityId}`}
                            />
                            <label htmlFor={`file-input-${entityId}`} className="text-white mr-2 py-1 px-3 rounded-md border-0 text-sm bg-blue-600 text-white hover:bg-blue-700"
                            >Add Files</label>


                            {/* Preview thumbnails */}
                            {/* Preview thumbnails */}
                            {imageGroups[entityId].previews.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {imageGroups[entityId].previews.map((preview, idx) => (
                                        <div key={idx} className="relative h-16 bg-gray-900 rounded overflow-hidden group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
                            }`}
                        disabled={Object.keys(imageGroups).length === 0 || isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Save to Database'}
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
                    <p className={`mt-3 text-sm ${message.includes("Error")
                        ? "text-red-300"
                        : message.includes("No ") || message.includes("Please")
                            ? "text-yellow-300"
                            : "text-green-300"
                        }`}>
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