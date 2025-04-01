"use client";

import { useState, useRef, ChangeEvent } from "react";
import { pokemon, UpdatePokemonPayload } from "@/lib/type";
import { updatePokemon } from "../(admin)/admin/pokemons/[pokemonId]/edit/action";
import { toast } from "react-toastify";

interface ImageChanges {
  added: File[];
  deleted: string[];
}

interface PokemonInfoProps {
  pokemon: pokemon;
}

function validatePokemonFields(editedPokemon: pokemon) {
  if (
    editedPokemon.name === "" ||
    editedPokemon.generation < 1 ||
    editedPokemon.height <= 0 ||
    editedPokemon.weight <= 0 ||
    editedPokemon.attack < 0 ||
    editedPokemon.defence < 0 ||
    editedPokemon.speed < 0 ||
    editedPokemon.type1 === "" ||
    editedPokemon.abilities.length === 0 ||
    editedPokemon.abilities.includes("")
  ) {
    return false;
  }
  return true;
}

export default function PokemonInfo({ pokemon }: PokemonInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState<pokemon>({ ...pokemon });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Track image changes
  const [imageChanges, setImageChanges] = useState<ImageChanges>({
    added: [],
    deleted: [],
  });

  // Track original images to compare against
  const [originalImages, setOriginalImages] = useState<{
    pictures: string[];
  }>({
    pictures: pokemon.pictures,
  });

  // Ref for file input
  const pictureFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    if (
      name === "height" ||
      name === "weight" ||
      name === "generation" ||
      name === "attack" ||
      name === "defence" ||
      name === "speed"
    ) {
      setEditedPokemon({
        ...editedPokemon,
        [name]: Number(value),
      });
    } else {
      setEditedPokemon({
        ...editedPokemon,
        [name]: value,
      });
    }
  };

  const handleAbilityChange = (index: number, newAbility: string) => {
    const newAbilities = [...editedPokemon.abilities];
    newAbilities[index] = newAbility;
    setEditedPokemon({
      ...editedPokemon,
      abilities: newAbilities,
    });
  };

  const handleAddAbility = () => {
    setEditedPokemon({
      ...editedPokemon,
      abilities: [...editedPokemon.abilities, ""],
    });
  };

  const handleRemoveAbility = (index: number) => {
    const newAbilities = editedPokemon.abilities.filter((_, i) => i !== index);
    setEditedPokemon({
      ...editedPokemon,
      abilities: newAbilities,
    });
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

      // Convert to preview URLs
      const newPictureUrls: string[] = [];
      newPictureFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPictureUrls.push(reader.result as string);

          if (newPictureUrls.length === files.length) {
            setEditedPokemon((prev) => ({
              ...prev,
              pictures: [...prev.pictures, ...newPictureUrls],
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
      pictures: editedPokemon.pictures.filter((pic) => pic !== pictureToDelete),
    });
    if (!pictureToDelete.startsWith("data:image")) {
      setImageChanges((prev) => ({
        ...prev,
        deleted: [...prev.deleted, pictureToDelete],
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    if (!validatePokemonFields(editedPokemon)) {
      toast.error("Please validate each element in form.")
      setIsSaving(false);
      return;
    }

    const formData = new FormData();

    // Add champion name
    formData.append("editedPokemon", JSON.stringify(editedPokemon));
    formData.append("pokemonName", pokemon.name);


    // Add new pictures
    imageChanges.added.forEach((file) => {
      formData.append("addedPictures", file);
    });

    // Add deleted picture URLs
    imageChanges.deleted.forEach((url) => {
      formData.append("deletedPictures", url);
    });

    try {
      const result = await updatePokemon(formData);

      setIsEditing(false);
      setImageChanges({
        added: [],
        deleted: [],
      });
      setOriginalImages({
        pictures: pokemon.pictures,
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
      // Ensure isSaving is set to false even if there's an error
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert to original state
    setIsEditing(false);
    setEditedPokemon({ ...pokemon });
    setImageChanges({
      added: [],
      deleted: [],
    });
  };

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

      {/* Success/Error Message */}
      {saveStatus === "success" && (
        <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-2 z-50">
          Pokemon updated successfully!
        </div>
      )}
      {saveStatus === "error" && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
          Failed to update pokemon. Please try again.
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex flex-col">
              {isEditing ? (
                <div>
                  <input
                    name="name"
                    value={editedPokemon.name}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-2xl font-normal mb-1"
                  />
                  <p
                    className={`${editedPokemon.name === "" ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Please insert pokemon's name
                  </p>
                </div>
              ) : (
                <h2 className="text-2xl font-normal">{pokemon.name}</h2>
              )}
              {isEditing ? (
                <div>
                  <input
                    name="class"
                    value={editedPokemon.class}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-sm italic"
                  />
                  <p
                    className={`${editedPokemon.class === "" ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Please insert pokemon's class
                  </p>
                </div>
              ) : (
                <p className="text-sm italic text-gray-300">{pokemon.class}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md font-medium ${isSaving
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
              <label className="block text-gray-400 text-sm">Type 1</label>
              {isEditing ? (
                <div>
                  <input
                    name="type1"
                    value={editedPokemon.type1}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.type1 === "" ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Please insert pokemon's name
                  </p>
                </div>
              ) : (
                <p>{pokemon.type1}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm">Type 2</label>
              {isEditing ? (
                <input
                  name="type2"
                  value={editedPokemon.type2 || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  placeholder="Optional second type"
                />
              ) : (
                <p>{pokemon.type2 || "None"}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm">Height (m)</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="height"
                    value={editedPokemon.height}
                    onChange={handleInputChange}
                    step="0.1"
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.height <= 0 ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Pokemon's height needs to be higher than 0
                  </p>
                </div>
              ) : (
                <p>{pokemon.height} m</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-sm">Weight (kg)</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="weight"
                    value={editedPokemon.weight}
                    onChange={handleInputChange}
                    step="0.1"
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.weight <= 0 ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Pokemon's weight needs to be higher than 0
                  </p>
                </div>
              ) : (
                <p>{pokemon.weight} kg</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-sm">Attack</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="attack"
                    value={editedPokemon.attack}
                    onChange={handleInputChange}
                    step="0.1"
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.attack < 0 ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Pokemon's attack needs to be higher than 0
                  </p>
                </div>
              ) : (
                <p>{pokemon.attack}</p>
              )}
            </div>

          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm">Defence</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="defence"
                    value={editedPokemon.defence ?? 0}
                    onChange={handleInputChange}
                    step="0.1"
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.defence < 0 ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Pokemon's defence needs to be higher than 0
                  </p>
                </div>
              ) : (
                <p>{pokemon.defence}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-sm">Speed</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="speed"
                    value={editedPokemon.speed}
                    onChange={handleInputChange}
                    step="0.1"
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.speed < 0 ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Pokemon's speed needs to be higher than 0
                  </p>
                </div>
              ) : (
                <p>{pokemon.speed}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-sm">Generation</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="generation"
                    value={editedPokemon.generation}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                  />
                  <p
                    className={`${editedPokemon.generation <= 0 ? "" : "hidden"
                      } text-cancelRed `}
                  >
                    Pokemon's generation needs to be higher than 0
                  </p>
                </div>
              ) : (
                <p>Generation {pokemon.generation}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Abilities
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  {editedPokemon.abilities.map((ability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        value={ability}
                        onChange={(e) =>
                          handleAbilityChange(index, e.target.value)
                        }
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
                  <p
                    className={`${editedPokemon.abilities.includes("") ||
                        editedPokemon.abilities.length < 1
                        ? ""
                        : "hidden"
                      } text-cancelRed `}
                  >
                    Please make sure there are no empty ability and atleast 1
                    ability.
                  </p>
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
            {(isEditing ? editedPokemon.pictures : pokemon.pictures).map(
              (picture, index) => (
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
              )
            )}
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
