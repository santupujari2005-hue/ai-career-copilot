import { readFile } from "fs/promises";

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const buffer = await readFile(filePath);
  const data = await pdfParse(buffer);
  return data.text.trim();
}
