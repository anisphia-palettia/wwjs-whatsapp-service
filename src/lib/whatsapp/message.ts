import {WhatsappClient} from "@/lib/whatsapp/client.ts";
import type {
    WhatsAppMessageBroadcastInput,
    WhatsAppMessageBroadcastWithImageInput,
    WhatsappMessageTextInput,
    WhatsAppMessageWithImageInput
} from "@/schema/whatsapp-message-schema.ts";
import {saveMedia, saveMessageMedia} from "@/utils/save-media.ts";
import {MessageMedia} from "whatsapp-web.js";
import {WhatsappChats} from "@/lib/whatsapp/chat.ts";
import type {IMessage} from "@/types/whatsapp.ts";
import {mapMessageToIMessage} from "@/utils/map-message-to-imessage.ts";
import fs from "fs";

export function WhatsappMessage(clientId: string, isGroup: boolean = false) {
    const client = WhatsappClient(clientId).getOrThrow()
    const whatsappChat = WhatsappChats(clientId)

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
        async messageByChatId(chatId: string): Promise<IMessage[]> {
            const chat = await whatsappChat.chatById(chatId)
            await chat.fetchMessages({limit: 200}).then((messages) => (messages.map(async (message) => {
                if (message.hasMedia) {
                    await saveMessageMedia(message, clientId, chatId)
                }
            })))
            return await chat.fetchMessages({limit: 200}).then((messages) => (messages.map(message => mapMessageToIMessage(message))))
        }
    }
}