import {Client, LocalAuth} from "whatsapp-web.js";
import {logger} from "../logger";
import {WhatsappClient} from "./client";
import {WhatsappQr} from "@/lib/whatsapp/qr.ts";

export function WhatsappManage(clientId: string) {
    const qrStore = WhatsappQr(clientId);
    const clientStore = WhatsappClient(clientId);

    return {
        async start(): Promise<"qr" | "ready"> {
            return new Promise(function (resolve, reject) {
                const client = new Client({
                    authStrategy: new LocalAuth({clientId: clientId}),
                    puppeteer: {
                        headless: true,
                        args: ['--no-sandbox'],
                    }
                });

                if (qrStore.has()) {
                    reject(new Error(`Client already started for clientId "${clientId}, please scan the QR code"`));
                    return;
                }

                const stop = setTimeout(async () => {
                    logger.warn(`🛑 Timeout 3 minutes, client terminated for clientId ${clientId}`);
                    await client.destroy();
                    qrStore.delete();
                    reject(new Error(`Timeout 3 minutes without scanning QR for clientId "${clientId}"`));
                }, 3 * 60 * 1000);

                client.on("qr", (qr) => {
                    logger.info(`🟡 QR generated for clientId ${clientId}`);
                    qrStore.setQr(qr);
                    resolve("qr");
                });

                client.on("ready", () => {
                    logger.info(`✅ Client ready for clientId ${clientId}`);
                    clientStore.set(client);
                    clearTimeout(stop);
                    resolve("ready");
                });

                client.on("auth_failure", (msg) => {
                    logger.error(`❌ Auth failed for clientId ${clientId}:`, msg);
                    clientStore.clear();
                    clearTimeout(stop);
                    client.destroy();
                    reject(new Error(`Auth failed for clientId "${clientId}"`));
                });

                client.on("disconnected", async (reason) => {
                    logger.warn(`⚠️ Client disconnected for clientId ${clientId}:`, reason);
                    await client.destroy();
                    clientStore.clear();
                    clearTimeout(stop);
                });

                client.initialize().catch(err => {
                    logger.error(`❌ Failed to initialize client for clientId ${clientId}:`, err);
                    reject(new Error(`Failed to initialize client for clientId "${clientId}"`));
                });
            });
        }
    };
}
