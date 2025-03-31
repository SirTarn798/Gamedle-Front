"use server"

import R2ClientSingleton, { deleteFromR2, uploadToR2 } from "@/lib/r2";
import { decrypt } from "@/lib/session";
import { UpdateChampPayload } from "@/lib/type";
import { generateFileName } from "@/lib/util";
import { cookies } from "next/headers";

export async function updatePokemon(formData: FormData) {
    const s3Client = R2ClientSingleton.getInstance();
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const pokemonName = formData.get('pokemonName') as string;

    const cookie = (await cookies()).get("session")?.value;
      const session = await decrypt(cookie);

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

    let editedPokemon = JSON.parse(formData.get("editedPokemon"));
    editedPokemon["deletedPictures"] = deletedPictures;
    editedPokemon["addedPictures"] = newImageUrls;
    delete editedPokemon["pictures"];
    const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/update_pokemon_and_image`;

    const response = await fetch(link, {
        method: "PATCH",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(editedPokemon)
    });
    return;
}