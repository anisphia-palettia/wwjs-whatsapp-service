import {WhatsappClient} from "./client";
import {HTTPException} from "hono/http-exception";
import type {IChat} from "@/types/whatsapp.ts";
import {mapChatToIChat} from "@/utils/map-chat-to-ichat.ts";

export function WhatsappChats(clientId: string) {
    const client = WhatsappClient(clientId).getOrThrow()

    return {
        async getOrThrowChatByChatId(chatId: string) {
            const chats = await this.all();

            const chat = chats.find((chat) => chat.chatId === chatId);

            if (!chat) {
                throw new HTTPException(404, {message: "Chat not found"});
            }

            return chat;
        },
        async all(): Promise<IChat[]> {
            const chats = await client.getChats()

            const filteredChat = chats
                .map((chat) => {
                    return mapChatToIChat(chat);
                });

            return filteredChat.length > 0 ? filteredChat : [];
        },
        async allGroup(): Promise<IChat[]> {
            const chats = await client.getChats()
            const filteredGroupChat = chats.filter((chat) => chat.isGroup)
                .map((chat) => {
                    return mapChatToIChat(chat);
                })
            return filteredGroupChat.length > 0 ? filteredGroupChat : [];
        },
        async chatById(chatId: string) {
            const chat = await this.getOrThrowChatByChatId(chatId)
            return await client.getChatById(chat.chatId)
        }
    }
}