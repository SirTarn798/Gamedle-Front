"use server"

import R2ClientSingleton, { deleteFromR2, uploadToR2 } from "@/lib/r2";
import { UpdateChampPayload } from "@/lib/type";
import { generateFileName } from "@/lib/util";

export async function updatePokemon(formData: FormData) {
    const s3Client = R2ClientSingleton.getInstance();

    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const pokemonName = formData.get('pokemonName') as string;

    // Array to store new image URLs
    const newImageUrls: string[] = [];

    // Handle new picture uploads
    const addedPictures = formData.getAll('addedPictures') as File[];
    for (const picture of addedPictures) {
        const pictureKey = `pokemon/picture/${pokemonName}/${generateFileName(picture.name)}`;
        await uploadToR2(pictureKey, picture);
        newImageUrls.push(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${pictureKey}`);
    }

    // Handle picture deletions
    const deletedPictures = formData.getAll('deletedPictures') as string[];
    for (const pictureUrl of deletedPictures) {
        const key = new URL(pictureUrl).pathname.slice(1);
        await deleteFromR2(key);
    }

    console.log(newImageUrls);
    // Update database with new champion details
    return;
}