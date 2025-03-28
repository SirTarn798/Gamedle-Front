"use server";

import R2ClientSingleton from "@/lib/r2";
import { decrypt } from "@/lib/session";
import { UploadedUrls } from "@/lib/type";
import { generateFileName } from "@/lib/util";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { url } from "inspector";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Cloudflare R2 Configuration
const r2Client = R2ClientSingleton.getInstance();
// Function to generate filename with datetime

// Server Action to Upload Multiple Images
export async function uploadImages(
  formData: FormData,
  type: "pokemon" | "champion",
  file: "picture" | "icon"
) {
  "use server";

  if (file === "icon") {
    await deleteExistingIcon(formData.get("entityName"));
  }

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

async function deleteExistingIcon(entityName: string) {
  const listParams = {
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Prefix: `champion/icon/${entityName}`,
  };
  const listedObjects = await r2Client.send(
    new ListObjectsV2Command(listParams)
  );

  if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
    console.log("Folder is empty or does not exist.");
    return;
  }

  // Step 2: Delete all objects
  const deleteParams = {
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Delete: {
      Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
    },
  };
  await r2Client.send(new DeleteObjectsCommand(deleteParams));
}

export async function saveToDatabase(
  urls: UploadedUrls,
  type: "pokemon" | "champion",
  file: "icon" | "picture"
) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  let link;
  if (file === "icon") {
    link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/upload_icon`;
  } else {
    link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/${type}_images/upload_image`;
  }
  const formatted = Object.fromEntries(
    Object.entries(urls).map(([key, value]) => [
      `${key}`,
      value.map(url => `${url}`)
    ])
  );
  console.log("formatted ", formatted)
  let formattedUrls;
  if (file === "icon") {
    formattedUrls = Object.fromEntries(
      Object.entries(formatted).map(([key, value]) => [`${key}`, `${value[0]}`])
    );
  } else {
    formattedUrls = formatted;
  }
  console.log("formatted url ", formattedUrls)
  const response = await fetch(link, {
    method: file === "icon" ? "PATCH" : "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application.json',
      Authorization: `Bearer ${session?.token}`,
    },
    body: JSON.stringify({
      formattedUrls
    })
  });

  console.log(response);
}

