import { S3Client } from "@aws-sdk/client-s3";

class R2ClientSingleton {
    private static instance: S3Client;

    private constructor() {}

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
