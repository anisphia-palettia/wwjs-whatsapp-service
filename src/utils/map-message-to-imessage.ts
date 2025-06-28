import type {Message} from "whatsapp-web.js";
import type {IMessage} from "@/types/whatsapp.ts";

export function mapMessageToIMessage(message: Message): IMessage {
    return {
        id: message.id._serialized,
        from: message.from,
        to: message.to,
        body: message.body,
        type: message.type,
        timestamp: message.timestamp * 1000,
        isFromMe: message.fromMe,
        mediaUrl: null,
        mediaType: null
    };
}