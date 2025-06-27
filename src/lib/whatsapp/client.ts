import {Client} from "whatsapp-web.js";
import {HTTPException} from "hono/http-exception";

const clients = new Map<string, Client>();

export function WhatsappClient(clientId: string) {
    return {
        set(newClient: Client): void {
            clients.set(clientId, newClient);
        },

        get(): Client | null {
            return clients.get(clientId) || null;
        },

        getOrThrow(): Client {
            const client = clients.get(clientId);
            if (!client) {
                throw new HTTPException(404, {
                    message: `Client for clientId "${clientId}" not found`
                });
            }
            return client;
        },

        clear(): void {
            clients.delete(clientId);
        },

        has(): boolean {
            return clients.has(clientId);
        }
    };
}

export function listWhatsappClients(): string[] {
    return Array.from(clients.keys());
}
