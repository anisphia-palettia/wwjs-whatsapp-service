import {WhatsappClient} from "@/lib/whatsapp/client.ts";
import type {
    WhatsAppMessageBroadcastWithImageInput,
    WhatsAppMessageBroadcastInput,
    WhatsappMessageTextInput,
    WhatsAppMessageWithImageInput
} from "@/schema/whatsapp-message-schema.ts";
import {saveMedia} from "@/utils/save-media.ts";
import {MessageMedia} from "whatsapp-web.js";

export function WhatsappMessage(clientId: string, isGroup: boolean = false) {
    const client = WhatsappClient(clientId).getOrThrow()

    function buildChatId(phoneNumber: string): string {
        if (phoneNumber.includes("@")) return phoneNumber;
        return `${phoneNumber}${isGroup ? "@g.us" : "@c.us"}`;
    }

    return {
        async text({text, recipient}: WhatsappMessageTextInput) {
            const targetId = buildChatId(recipient);
            await client.sendMessage(targetId, text);
        },
        async withImage({recipient, image, caption}: WhatsAppMessageWithImageInput) {
            const targetId = buildChatId(recipient)
            const filePath = await saveMedia(image)
            const imageMessage = MessageMedia.fromFilePath(filePath)
            await client.sendMessage(targetId, imageMessage, caption ? {caption} : {})
        },
        async broadcast({recipients, text}: WhatsAppMessageBroadcastInput) {
            for (const recipient of recipients) {
                const targetId = buildChatId(recipient)
                await client.sendMessage(targetId, text)
            }
        },
        async broadcastWithImage({recipients, image, caption}: WhatsAppMessageBroadcastWithImageInput) {
            for (const recipient of recipients) {
                const targetId = buildChatId(recipient)
                const filePath = await saveMedia(image)
                const imageMessage = MessageMedia.fromFilePath(filePath)
                await client.sendMessage(targetId, imageMessage, caption ? {caption} : {})
            }
        },
    }
}