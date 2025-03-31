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

    editedChamp["nick_name"] = editedChamp["title"];
    editedChamp["icon"] = editedChamp["icon_url"];
    editedChamp["roles"] = editedChamp["roles"].map((role) => {
        if(role === "Top") return "top";
        else if(role === "Jungle") return "jungle";
        else if(role === "Middle") return "mid";
        else if(role === "Bottom") return "bottom";
        else if(role === "Support") return "support";

    }) 


    delete editedChamp["pictures"];
    delete editedChamp["title"];
    delete editedChamp["icon_url"];

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
    console.log(JSON.stringify(editedChamp))
    return;
}

export async function getChampById(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/${id}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(error)
    }
}

export async function getPicsByChampId(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champion_images/image_champion_id`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ champion_id: id })
        })
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(error)
    }
}