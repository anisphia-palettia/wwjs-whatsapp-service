import { HTTPException } from "hono/http-exception";

const qr = new Map<string, string>();

export function WhatsappQr(clientId?: string) {
    if (!clientId) {
        throw new Error("clientId is required");
    }
    return {
        setQr(value: string): void {
            qr.set(clientId, value);
        },

        getQr(): string {
            if (!qr.has(clientId)) {
                throw new HTTPException(404, {
                    message: `QR for clientId "${clientId}" not found`
                });
            }
            return qr.get(clientId)!;
        },

        delete(): boolean {
            return qr.delete(clientId);
        },

        has(): boolean {
            return qr.has(clientId);
        }
    };
}
