import {WhatsappClient} from "./client";
import {HTTPException} from "hono/http-exception";

export function WhatsappChats(clientId: string) {
    const client = WhatsappClient(clientId).getOrThrow()

    return {
        async getOrThrowChatByChatId(chatId: string) {
            const chats = await this.allChats();

            const chat = chats.find((chat) => chat.chatId === chatId); // pastikan kamu pakai "id" atau "chatId"

            if (!chat) {
                throw new HTTPException(404, {message: "Chat not found"});
            }

            return chat;
        },
        async allChats() {
            const chats = await client.getChats()

            const filteredChat = chats
                .map((chat) => ({
                    name: chat.name,
                    chatId: chat.id._serialized,
                    timestamp: chat.timestamp,
                }));

            return filteredChat.length > 0 ? filteredChat : [];
        },
        async allGroupChats() {
            const chats = await client.getChats()
            const filteredGroupChat = chats.filter((chat) => chat.isGroup)
                .map((chat) => ({
                    name: chat.name,
                    chatId: chat.id._serialized,
                    timestamp: chat.timestamp,
                }))
            return filteredGroupChat.length > 0 ? filteredGroupChat : [];
        },
        async allMessageByChatId(chatId: string) {
            const chat = await this.getOrThrowChatByChatId(chatId)
            return await client.getMessageById(chat.chatId);
        }
    }
}