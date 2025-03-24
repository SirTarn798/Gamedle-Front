"use server"

import R2ClientSingleton from "@/lib/r2";
import { UpdateChampPayload } from "@/lib/type";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function updateChampion(payload : UpdateChampPayload) {
    console.log(payload)
    return;
    const s3Client = R2ClientSingleton.getInstance();

    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    // Array to store new image URLs
    const newImageUrls: string[] = [];

    // Handle icon upload if new icon exists

    //TARN's NOTE : Fuck .pictures, send .addedPictures and .deletedPictures or .icon to server. Also make this handle Pokemon as well
    if (payload.updates.imageChanges.icon) {
        const iconKey = `champions/${payload.championId}/icon-${Date.now()}`;
        const iconUploadCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: iconKey,
            Body: await payload.updates.imageChanges.icon?.arrayBuffer(),
            ContentType: payload.updates.imageChanges.icon?.type
        });

        await s3Client.send(iconUploadCommand);
        newImageUrls.push(`https://${bucket}.r2.cloudflarestorage.com/${iconKey}`);
    }

    // Handle new picture uploads
    for (const picture of payload.updates.imageChanges.addedPictures) {
        const pictureKey = `champions/${payload.championId}/picture-${Date.now()}-${picture.name}`;
        const pictureUploadCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: pictureKey,
            Body: await picture.arrayBuffer(),
            ContentType: picture.type
        });

        await s3Client.send(pictureUploadCommand);
        newImageUrls.push(`https://${bucket}.r2.cloudflarestorage.com/${pictureKey}`);
    }

    // Handle picture deletions
    for (const pictureUrl of payload.updates.imageChanges.deletedPictures) {
        // Extract the key from the URL
        const key = new URL(pictureUrl).pathname.slice(1);
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key
        });

        await s3Client.send(deleteCommand);
    }

    // Update database with new champion details
    return;
}