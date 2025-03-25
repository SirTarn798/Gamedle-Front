"use server"

import R2ClientSingleton from "@/lib/r2";
import { UpdateChampPayload } from "@/lib/type";
import { generateFileName } from "@/lib/util";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function updateChampion(payload : UpdateChampPayload) {
    console.log(payload)
    const s3Client = R2ClientSingleton.getInstance();

    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    // Array to store new image URLs
    const newImageUrls: string[] = [];

    // Handle icon upload if new icon exists

    //TARN's NOTE : Fuck .pictures, send .addedPictures and .deletedPictures or .icon to server. Also make this handle Pokemon as well
    if (payload.updates.imageChanges.icon) {
        const iconKey = `champion/icon/${payload.championName}/${generateFileName(payload.updates.imageChanges.icon?.name || "")}`;
        const iconUploadCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: iconKey,
            Body: await payload.updates.imageChanges.icon?.arrayBuffer(),
            ContentType: payload.updates.imageChanges.icon?.type
        });

        await s3Client.send(iconUploadCommand);
        newImageUrls.push(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${iconKey}`);
    }

    // Handle new picture uploads
    for (const picture of payload.updates.imageChanges.addedPictures) {
        const pictureKey = `champion/picture/${payload.championName}/${generateFileName(picture.name)}`;
        const pictureUploadCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: pictureKey,
            Body: await picture.arrayBuffer(),
            ContentType: picture.type
        });

        await s3Client.send(pictureUploadCommand);
        newImageUrls.push(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${pictureKey}`);
    }

    // Handle picture deletions
    for (const pictureUrl of payload.updates.imageChanges.deletedPictures) {
        // Extract the key from the URL
        const key = new URL(pictureUrl).pathname.slice(1);
        console.log(key)
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucket,
            Key: decodeURIComponent(key)
        });
        console.log("Done deleting : ", payload.updates.imageChanges.deletedPictures)
        await s3Client.send(deleteCommand);
    }
    console.log(newImageUrls);
    // Update database with new champion details
    return;
}