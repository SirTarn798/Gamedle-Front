import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

class R2ClientSingleton {
    private static instance: S3Client;

    private constructor() { }

    public static getInstance(): S3Client {
        if (!R2ClientSingleton.instance) {
            R2ClientSingleton.instance = new S3Client({
                region: "auto",
                endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
                credentials: {
                    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
                },
            });
        }
        return R2ClientSingleton.instance;
    }
}

export default R2ClientSingleton;

export async function uploadToR2(fileName: string, picture: File) {
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const r2Client = R2ClientSingleton.getInstance();
    const pictureUploadCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: await picture.arrayBuffer(),
        ContentType: picture.type
    });

    await r2Client.send(pictureUploadCommand);
}

export async function deleteFromR2(key: string) {
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const r2Client = R2ClientSingleton.getInstance();
    const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: decodeURIComponent(key)
    });
    await r2Client.send(deleteCommand);

}