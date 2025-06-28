import type {Chat} from "whatsapp-web.js";
import type {IChat} from "@/types/whatsapp.ts";

export function mapChatToIChat(chat: Chat): IChat {
    return {
        name: chat.name,
        isGroup: chat.isGroup,
        chatId: chat.id._serialized,
        unreadCount: chat.unreadCount,
        timestamp: (chat.timestamp ?? 0) * 1000
    };
}