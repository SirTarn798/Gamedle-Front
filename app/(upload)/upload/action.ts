"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

// Cloudflare R2 Configuration
const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
});
// Function to generate filename with datetime
function generateFileName(originalName: string) {
    const timestamp = new Date().toISOString()
    const extension = originalName.split(".").pop(); // Get file extension
    return `${timestamp}.${extension}`; // e.g., "20250323_153045.jpg"
}

// Server Action to Upload Multiple Images
export async function uploadImages(formData: FormData, type : "pokemon" | "champion", file : "picture" | "icon") {
    "use server";
    
    // Debug what's in the formData
    const files = formData.getAll("files") as File[]; // Get all files from formData
    
    if (!files || files.length === 0) return { error: "No files uploaded" };

    try {
        const uploadedFiles = await Promise.all(
            files.map(async (filePic) => {
                const buffer = Buffer.from(await filePic.arrayBuffer());
                const folderName = `${type}/${file}/${formData.get("entityName")}`; // Change this to your desired folder
                const fileName = `${folderName}/${generateFileName(filePic.name)}`;
                await r2Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
                        Key: fileName,
                        Body: buffer,
                        ContentType: filePic.type,
                    })
                );

                return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`; // Generate public URL
            })
        );

        revalidatePath("/");

        return { success: true, urls: uploadedFiles }; // Return all uploaded URLs
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Upload failed", success: false };
    }
}
