import {LocalHono} from "@/types/LocalHono.ts";
import validate from "@/middleware/validate.ts";
import {whatsappMessageSchema, type WhatsappMessageTextInput} from "@/schema/whatsapp-message-schema.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import {WhatsappMessage} from "@/lib/whatsapp/message.ts";
import {sendSuccess} from "@/utils/response-handler.ts";

const m_textHandler = new LocalHono()

m_textHandler.post("",
    withClientId(),
    validate("json", whatsappMessageSchema.text),
    async (c) => {
        const clientId = c.get("clientId")
        const data = c.req.valid("json") as WhatsappMessageTextInput
        await WhatsappMessage(clientId).text(data)
        return sendSuccess(c, {
            message: `Success clientId ${clientId} send text message`,
            data: {
                recipient: data.recipient,
                text: data.text,
            }
        })
    })

export default m_textHandler