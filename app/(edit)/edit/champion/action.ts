"use server"

import R2ClientSingleton, { deleteFromR2, uploadToR2 } from "@/lib/r2";
import { UpdateChampPayload } from "@/lib/type";
import { generateFileName } from "@/lib/util";

export async function updateChampion(formData: FormData) {
    const s3Client = R2ClientSingleton.getInstance();
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const championName = formData.get('championName') as string;
    console.log(formData);
    // Array to store new image URLs
    const newImageUrls: string[] = [];

    // Handle icon upload if new icon exists
    const iconFile = formData.get('icon') as File | null;
    if (iconFile && iconFile.size > 0) {
        const iconKey = `champion/icon/${championName}/${generateFileName(iconFile.name)}`;
        await uploadToR2(iconKey, iconFile);
        newImageUrls.push(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${iconKey}`);
    }

    // Handle new picture uploads
    const addedPictures = formData.getAll('addedPictures') as File[];
    for (const picture of addedPictures) {
        const pictureKey = `champion/picture/${championName}/${generateFileName(picture.name)}`;
        await uploadToR2(pictureKey, picture);
        newImageUrls.push(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${pictureKey}`);
    }

    // Handle picture deletions
    const deletedPictures = formData.getAll('deletedPictures') as string[];
    for (const pictureUrl of deletedPictures) {
        const key = new URL(pictureUrl).pathname.slice(1);
        await deleteFromR2(key);
    }

    const editedChamp = JSON.parse(formData.get("editedChamp"));
    console.log(editedChamp);

    return;
}