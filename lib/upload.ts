import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUploadedFile(
  file: File,
  userId: string
): Promise<{ fileUrl: string; fileName: string }> {
  const userDir = path.join(UPLOAD_DIR, userId);
  await mkdir(userDir, { recursive: true });

  const ext = path.extname(file.name) || ".pdf";
  const fileName = `${randomUUID()}${ext}`;
  const filePath = path.join(userDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  return {
    fileUrl: `/uploads/${userId}/${fileName}`,
    fileName: file.name,
  };
}

export function getFilePathFromUrl(fileUrl: string): string {
  return path.join(process.cwd(), "public", fileUrl.replace(/^\//, ""));
}
