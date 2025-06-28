import {LocalHono} from "@/types/LocalHono.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import {WhatsappChats} from "@/lib/whatsapp/chat.ts";
import {sendSuccess} from "@/utils/response-handler.ts";

const c_allHandler = new LocalHono()

c_allHandler.get("",
    withClientId(),
    async (c) => {
        const clientId = c.get("clientId")
        const chats = await WhatsappChats(clientId).all()
        return sendSuccess(c, {
            message: "Success get all client chats",
            data: {
                clientId: clientId,
                chats: chats
            }
        })
    }
)

export default c_allHandler