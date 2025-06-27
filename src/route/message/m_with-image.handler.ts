import {LocalHono} from "@/types/LocalHono.ts";
import validate from "@/middleware/validate.ts";
import {
    whatsappMessageSchema,
    type WhatsappMessageTextInput,
    type WhatsAppMessageWithImageInput
} from "@/schema/whatsapp-message-schema.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import {WhatsappMessage} from "@/lib/whatsapp/message.ts";
import {sendSuccess} from "@/utils/response-handler.ts";

const m_withImageHandler = new LocalHono()

m_withImageHandler.post("",
    withClientId(),
    validate("form", whatsappMessageSchema.withImage),
    async (c) => {
        const clientId = c.get("clientId")
        const data = c.req.valid("form") as WhatsAppMessageWithImageInput
        await WhatsappMessage(clientId).withImage(data)
        return sendSuccess(c, {
            message: `Success clientId ${clientId} send with image message`,
            data: {
                recipient: data.recipient,
                caption: data.caption,
                image: data.image.name
            }
        })
    })

export default m_withImageHandler