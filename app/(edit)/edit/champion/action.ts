"use server"

import R2ClientSingleton, { deleteFromR2, uploadToR2 } from "@/lib/r2";
import { decrypt } from "@/lib/session";
import { UpdateChampPayload } from "@/lib/type";
import { generateFileName } from "@/lib/util";
import { cookies } from "next/headers";

export async function updateChampion(formData: FormData) {
    const s3Client = R2ClientSingleton.getInstance();
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const championName = formData.get('championName') as string;
    const cookie = (await cookies()).get("session")?.value;
      const session = await decrypt(cookie);
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

    let editedChamp = JSON.parse(formData.get("editedChamp"));
    editedChamp["deletedPictures"] = deletedPictures;
    editedChamp["addedPictures"] = newImageUrls;
    delete editedChamp["pictures"];
    console.log(editedChamp);
    const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/update_champion_and_image`;

    const response = await fetch(link, {
        method: "PATCH",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(editedChamp)
    });
    return;
}