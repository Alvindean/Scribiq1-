import { put, del } from "@vercel/blob";

export interface UploadOptions {
  key: string;
  body: Buffer | ArrayBuffer | Uint8Array | ReadableStream;
  contentType: string;
  metadata?: Record<string, string>;
}

export async function uploadToR2(options: UploadOptions): Promise<string> {
  const { key, body, contentType } = options;

  const buffer =
    body instanceof ArrayBuffer
      ? Buffer.from(body)
      : body instanceof Uint8Array
      ? Buffer.from(body)
      : body;

  const blob = await put(key, buffer as Buffer, {
    access: "public",
    contentType,
  });

  return blob.url;
}

export async function deleteFromR2(key: string): Promise<void> {
  await del(key);
}

export function buildR2Key(
  orgId: string,
  projectId: string,
  type: "audio" | "video" | "image" | "export",
  filename: string
): string {
  return `${orgId}/${projectId}/${type}/${filename}`;
}
