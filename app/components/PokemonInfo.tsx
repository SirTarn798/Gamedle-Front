"use client"

import { useState, useRef, ChangeEvent } from "react";
import { pokemon, UpdatePokemonPayload } from "@/lib/type";
import { updatePokemon } from "../(edit)/edit/pokemon/action";

interface ImageChanges {
    added: File[];
    deleted: string[];
}

interface PokemonInfoProps {
    pokemon : pokemon
  }

export default function PokemonInfo({ pokemon }: PokemonInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState<pokemon>({ ...pokemon });
  
  // Track image changes
  const [imageChanges, setImageChanges] = useState<ImageChanges>({
    added: [],
    deleted: []
  });

  // Track original images to compare against
  const [originalImages, setOriginalImages] = useState<{
    pictures: string[];
  }>({
    pictures: pokemon.pictures
  });

  // Ref for file input
  const pictureFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    if (name === "height" || name === "weight" || name === "generation" || name === "id") {
      setEditedPokemon({
        ...editedPokemon,
        [name]: Number(value)
      });
    } else {
      setEditedPokemon({
        ...editedPokemon,
        [name]: value
      });
    }
  };

  const handleAbilityChange = (index: number, newAbility: string) => {
    const newAbilities = [...editedPokemon.abilities];
    newAbilities[index] = newAbility;
    setEditedPokemon({
      ...editedPokemon,
      abilities: newAbilities
    });
  };

  const handleAddAbility = () => {
    setEditedPokemon({
      ...editedPokemon,
      abilities: [...editedPokemon.abilities, ""]
    });
  };

  const handleRemoveAbility = (index: number) => {
    const newAbilities = editedPokemon.abilities.filter((_, i) => i !== index);
    setEditedPokemon({
      ...editedPokemon,
      abilities: newAbilities
    });
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
            setEditedPokemon(prev => ({
              ...prev,
              pictures: [...prev.pictures, ...newPictureUrls]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeletePicture = (pictureToDelete: string) => {
    setEditedPokemon({
      ...editedPokemon,
      pictures: editedPokemon.pictures.filter(pic => pic !== pictureToDelete)
    });

    setImageChanges(prev => ({
      ...prev,
      deleted: [...prev.deleted, pictureToDelete]
    }));
  };

//   const handleSave = async () => {
//     // In a real application, you would send the update to a backend
//     try {
//       setIsEditing(false);
//       setImageChanges({
//         added: [],
//         deleted: []
//       });
//       setOriginalImages({
//         pictures: editedPokemon.pictures
//       });
//     } catch (error) {
//       console.error("Failed to update Pokemon", error);
//       // Handle error (show message, etc.)
//     }
//   };

  const handleSave = async () => {
      // Prepare the payload for server action
      const payload : UpdatePokemonPayload = {
        pokemonName: pokemon.name,
        updates: {
          ...editedPokemon,
          imageChanges: {
            addedPictures: imageChanges.added, 
            deletedPictures: imageChanges.deleted 
          }
        }
      };
  
      try {
        const result = await updatePokemon(payload)
        
        // Reset state after successful save
        setIsEditing(false);
        setImageChanges({
          added: [],
          deleted: []
        });
        setOriginalImages({
          pictures: editedPokemon.pictures
        });
      } catch (error) {
        console.error("Failed to update champion", error);
        // Handle error (show message, etc.)
      }
    };

  const handleCancel = () => {
    // Revert to original state
    setIsEditing(false);
    setEditedPokemon({ ...pokemon });
    setImageChanges({
      added: [],
      deleted: []
    });
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex flex-col">
              {isEditing ? (
                <input
                  name="name"
                  value={editedPokemon.name}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded text-2xl font-normal mb-1"
                />
              ) : (
                <h2 className="text-2xl font-normal">{pokemon.name}</h2>
              )}
              {isEditing ? (
                <input
                  name="class"
                  value={editedPokemon.class}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded text-sm italic"
                />
              ) : (
                <p className="text-sm italic text-gray-300">{pokemon.class}</p>
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
              <label className="block text-gray-400 text-sm">Type 1</label>
              {isEditing ? (
                <input
                  name="type1"
                  value={editedPokemon.type1}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
              ) : (
                <p>{pokemon.type1}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm">Type 2</label>
              {isEditing ? (
                <input
                  name="typ2"
                  value={editedPokemon.typ2 || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  placeholder="Optional second type"
                />
              ) : (
                <p>{pokemon.typ2 || "None"}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm">Height (m)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="height"
                  value={editedPokemon.height}
                  onChange={handleInputChange}
                  step="0.1"
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
              ) : (
                <p>{pokemon.height} m</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm">Weight (kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="weight"
                  value={editedPokemon.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
              ) : (
                <p>{pokemon.weight} kg</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm">Generation</label>
              {isEditing ? (
                <input
                  type="number"
                  name="generation"
                  value={editedPokemon.generation}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
              ) : (
                <p>Generation {pokemon.generation}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Abilities</label>
              {isEditing ? (
                <div className="space-y-2">
                  {editedPokemon.abilities.map((ability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        value={ability}
                        onChange={(e) => handleAbilityChange(index, e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                        placeholder="Ability name"
                      />
                      <button
                        onClick={() => handleRemoveAbility(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddAbility}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    Add Ability
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {pokemon.abilities.map((ability, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-900 px-2 py-1 rounded text-xs"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold mr-4">Pokemon Images</h3>
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
            {(isEditing ? editedPokemon.pictures : pokemon.pictures).map((picture, index) => (
              <div key={index} className="relative group">
                <img 
                  src={picture} 
                  alt={`${pokemon.name} splash ${index}`} 
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