import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? "";

export interface UploadOptions {
  key: string;
  body: Buffer | ArrayBuffer | Uint8Array | ReadableStream;
  contentType: string;
  metadata?: Record<string, string>;
}

export async function uploadToR2(options: UploadOptions): Promise<string> {
  const { key, body, contentType, metadata } = options;

  const buffer =
    body instanceof ArrayBuffer ? Buffer.from(body) : body;

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer as Buffer,
      ContentType: contentType,
      Metadata: metadata,
    })
  );

  // Return public URL if configured, otherwise generate signed URL
  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${key}`;
  }

  return getSignedUrl(R2, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function deleteFromR2(key: string): Promise<void> {
  await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const { getSignedUrl: getPresigned } = await import("@aws-sdk/s3-request-presigner");
  const { PutObjectCommand: Put } = await import("@aws-sdk/client-s3");
  return getPresigned(R2, new Put({ Bucket: BUCKET, Key: key, ContentType: contentType }), {
    expiresIn,
  });
}

export function buildR2Key(
  orgId: string,
  projectId: string,
  type: "audio" | "video" | "image" | "export",
  filename: string
): string {
  return `${orgId}/${projectId}/${type}/${filename}`;
}
