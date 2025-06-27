import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import mime from "mime-types";

export async function saveMedia(image: any): Promise<string> {
    const buffer = Buffer.from(await image.arrayBuffer());
    const mimeType = image.type || "application/octet-stream";
    const ext = mime.extension(mimeType) || "bin";

    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const fileName = `${hash}.${ext}`;
    const filePath = path.join(process.cwd(), "public", fileName);

    try {
        try {
            await fs.access(filePath);
            return filePath;
        } catch {
            await fs.writeFile(filePath, buffer);
            return filePath;
        }
    } catch (error) {
        console.error("Failed to save image:", error);
        throw new Error("Gagal menyimpan gambar");
    }
}