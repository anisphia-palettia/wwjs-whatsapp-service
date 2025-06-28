import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import mime from "mime-types";
import type {Message, MessageMedia} from "whatsapp-web.js";
import {HTTPException} from "hono/http-exception";

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

export async function saveMessageMedia(message: Message, clientId: string, chatId: string) {
    const media = await message.downloadMedia();
    if (!media || !media.data || !media.mimetype) {
        throw new HTTPException(400, {message: "Media not valid"});
    }
    const extension = media.mimetype.split('/')[1];
    const filename = `${message.id.id}.${extension}`;
    const dirPath = path.join("public", clientId, chatId);
    const filePath = path.join(dirPath, filename);
    await fs.mkdir(dirPath, {recursive: true});
    await fs.writeFile(filePath, media.data, {encoding: 'base64'});
}