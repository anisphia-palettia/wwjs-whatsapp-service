import {LocalHono} from "@/types/LocalHono.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import validate from "@/middleware/validate.ts";
import {
    type WhatsAppMessageBroadcastWithImageInput,
    whatsappMessageSchema, type WhatsAppMessageWithImageInput,
} from "@/schema/whatsapp-message-schema.ts";
import {WhatsappMessage} from "@/lib/whatsapp/message.ts";
import {sendSuccess} from "@/utils/response-handler.ts";

const m_broadcastWithImageHandler = new LocalHono()

m_broadcastWithImageHandler.post(
    withClientId(),
    validate("form", whatsappMessageSchema.broadcastWithImage),
    async (c) => {
        const clientId = c.get("clientId")
        const data = c.req.valid("form") as WhatsAppMessageBroadcastWithImageInput
        await WhatsappMessage(clientId).broadcastWithImage(data)
        return sendSuccess(c, {
            message: `Success clientId ${clientId} send text message`,
            data: {
                recipients: data.recipients,
                caption: data.caption,
                image: data.image.name
            }
        })
    })

export default m_broadcastWithImageHandler