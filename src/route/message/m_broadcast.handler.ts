import {LocalHono} from "@/types/LocalHono.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import validate from "@/middleware/validate.ts";
import {
    type WhatsAppMessageBroadcastInput,
    whatsappMessageSchema,
} from "@/schema/whatsapp-message-schema.ts";
import {WhatsappMessage} from "@/lib/whatsapp/message.ts";
import {sendSuccess} from "@/utils/response-handler.ts";

const m_broadcastHandler = new LocalHono()

m_broadcastHandler.post(
    withClientId(),
    validate("json", whatsappMessageSchema.broadcast),
    async (c) => {
        const clientId = c.get("clientId")
        const data = c.req.valid("json") as WhatsAppMessageBroadcastInput
        await WhatsappMessage(clientId).broadcast(data)
        return sendSuccess(c, {
            message: `Success clientId ${clientId} send text message`,
            data: {
                recipients: data.recipients,
                text: data.text,
            }
        })
    })

export default m_broadcastHandler