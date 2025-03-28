"use client";

import { useState, useRef, ChangeEvent } from "react";
import { champion, lane, UpdateChampPayload } from "@/lib/type";
import { updateChampion } from "../(admin)/admin/champions/[championId]/edit/action";
import { toast } from "react-toastify";

interface ChampionInfoProps {
  champ?: champion; // Make champ optional
}

interface ImageChanges {
  added: File[];
  deleted: string[];
  icon?: File;
}

export default function ChampionInfo({ champ }: ChampionInfoProps) {
  // Early return if champ is undefined
  if (!champ) {
    return <div>Loading champion data...</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editedChamp, setEditedChamp] = useState<champion>({ ...champ });

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
    icon: string;
    pictures: string[];
  }>({
    icon: champ.icon_url,
    pictures: champ.pictures || [], // Add fallback for pictures
  });

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
    if (editedChamp.roles?.includes(role)) {
      setEditedChamp({
        ...editedChamp,
        roles: editedChamp.roles.filter((r) => r !== role),
      });
    } else {
      setEditedChamp({
        ...editedChamp,
        roles: [...(editedChamp.roles || []), role],
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
          icon_url: reader.result as string, // Changed from 'icon' to 'icon_url'
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

      // Convert to preview URLs
      const newPictureUrls: string[] = [];
      newPictureFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPictureUrls.push(reader.result as string);

          if (newPictureUrls.length === files.length) {
            setEditedChamp((prev) => ({
              ...prev,
              pictures: [...(prev.pictures || []), ...newPictureUrls], // Add fallback for pictures
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
      pictures: (editedChamp.pictures || []).filter((pic) => pic !== pictureToDelete), // Add fallback for pictures
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
    if (
      editedChamp.name === "" ||
      editedChamp.title === "" ||
      editedChamp.class === "" ||
      editedChamp.region === "" ||
      (editedChamp.roles || []).length === 0 ||
      editedChamp.resource_type === ""
    ) {
      toast.error("Please validate each element in the form.");
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

    // Add deleted picture URLs
    imageChanges.deleted.forEach((url) => {
      formData.append("deletedPictures", url);
    });

    try {
      const result = await updateChampion(formData);

      // Reset state after successful save
      setIsEditing(false);
      setImageChanges({
        added: [],
        deleted: [],
      });
      setOriginalImages({
        icon: editedChamp.icon_url,
        pictures: editedChamp.pictures || [], // Add fallback for pictures
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
    setEditedChamp({ ...champ });
    setImageChanges({
      added: [],
      deleted: [],
    });
  };

  // Available lanes for the dropdown
  const lanes: lane[] = ["top", "jungle", "mid", "bot", "support"];

  return (
    <div></div>
    
              
            
          )
        
      
    
  
}