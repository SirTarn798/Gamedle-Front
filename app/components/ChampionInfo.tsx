"use client"

import { useState, useRef, ChangeEvent } from "react";
import { champion, lane, UpdateChampPayload } from "@/lib/type";
import { updateChampion } from "../(edit)/edit/champion/action";

interface ChampionInfoProps {
  champ: champion;
}

interface ImageChanges {
    added: File[];
    deleted: string[];
    icon?: File;

  }

export default function ChampionInfo({ champ }: ChampionInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedChamp, setEditedChamp] = useState<champion>({ ...champ });
  
  // Track image changes
  const [imageChanges, setImageChanges] = useState<ImageChanges>({
    added: [],
    deleted: []
  });

  // Track original images to compare against
  const [originalImages, setOriginalImages] = useState<{
    icon: string;
    pictures: string[];
  }>({
    icon: champ.icon,
    pictures: champ.picture
  });

  // Refs for file inputs
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const pictureFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "release_date") {
      // Handle date
      setEditedChamp({
        ...editedChamp,
        [name]: new Date(value)
      });
    } else {
      // Handle other fields
      setEditedChamp({
        ...editedChamp,
        [name]: value
      } as any);
    }
  };

  const handleRoleChange = (role: lane) => {
    if (editedChamp.role.includes(role)) {
      setEditedChamp({
        ...editedChamp,
        role: editedChamp.role.filter(r => r !== role)
      });
    } else {
      setEditedChamp({
        ...editedChamp,
        role: [...editedChamp.role, role]
      });
    }
  };

  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Track icon change
      setImageChanges(prev => ({
        ...prev,
        icon: file
      }));

      // Create a URL for the uploaded file
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedChamp({
          ...editedChamp,
          icon: reader.result as string
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
      setImageChanges(prev => ({
        ...prev,
        added: [...prev.added, ...newPictureFiles]
      }));

      // Convert to preview URLs
      const newPictureUrls: string[] = [];
      newPictureFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPictureUrls.push(reader.result as string);
          
          if (newPictureUrls.length === files.length) {
            setEditedChamp(prev => ({
              ...prev,
              picture: [...prev.picture, ...newPictureUrls]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeletePicture = (pictureToDelete: string) => {
    setEditedChamp({
      ...editedChamp,
      picture: editedChamp.picture.filter(pic => pic !== pictureToDelete)
    });

    setImageChanges(prev => ({
      ...prev,
      deleted: [...prev.deleted, pictureToDelete]
    }));
  };

  const handleSave = async () => {
    // Prepare the payload for server action
    const payload : UpdateChampPayload = {
      championName: champ.name,
      updates: {
        ...editedChamp,
        imageChanges: {
          icon: imageChanges.icon,
          addedPictures: imageChanges.added, 
          deletedPictures: imageChanges.deleted 
        }
      }
    };

    try {
      const result = await updateChampion(payload)
      
      // Reset state after successful save
      setIsEditing(false);
      setImageChanges({
        added: [],
        deleted: []
      });
      setOriginalImages({
        icon: editedChamp.icon,
        pictures: editedChamp.picture
      });
    } catch (error) {
      console.error("Failed to update champion", error);
      // Handle error (show message, etc.)
    }
  };

  const handleCancel = () => {
    // Revert to original state
    setIsEditing(false);
    setEditedChamp({ ...champ });
    setImageChanges({
      added: [],
      deleted: []
    });
  };

  // Available lanes for the dropdown
  const lanes: lane[] = ["top", "jungle", "mid", "bot", "support"];

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative group">
              <img 
                src={isEditing ? editedChamp.icon : champ.icon} 
                alt={champ.name} 
                className="w-16 h-16 rounded-full mr-4 border-2 border-yellow-500 group-hover:opacity-50 transition-opacity"
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
                <input
                  name="name"
                  value={editedChamp.name}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded text-2xl font-normal mb-1"
                />
              ) : (
                <h2 className="text-2xl font-normal">{champ.name}</h2>
              )}
              {isEditing ? (
                <input
                  name="nick_name"
                  value={editedChamp.nick_name}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded text-sm italic"
                />
              ) : (
                <p className="text-sm italic text-gray-300">{champ.nick_name}</p>
              )}
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-md font-medium ${
              isEditing 
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
                <input
                  name="region"
                  value={editedChamp.region}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
              ) : (
                <p>{champ.region}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm">Class</label>
              {isEditing ? (
                <input
                  name="class"
                  value={editedChamp.class}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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
                        checked={editedChamp.role.includes(lane)}
                        onChange={() => handleRoleChange(lane)}
                        className="mr-2"
                      />
                      <label htmlFor={`role-${lane}`} className="capitalize">
                        {lane}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {champ.role.map((role, index) => (
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
                  <option value="melee">Melee</option>
                  <option value="ranged">Ranged</option>
                </select>
              ) : (
                <p className="capitalize">{champ.range_type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm">Resource Type</label>
              {isEditing ? (
                <input
                  name="resource_type"
                  value={editedChamp.resource_type}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
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
              value={editedChamp.release_date.toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          ) : (
            <p>{champ.release_date.toLocaleDateString()}</p>
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
            {(isEditing ? editedChamp.picture : champ.picture).map((picture, index) => (
              <div key={index} className="relative group">
                <img 
                  src={picture} 
                  alt={`${champ.name} splash ${index}`} 
                  className="w-full h-48 object-cover rounded-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => handleDeletePicture(picture)}
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

