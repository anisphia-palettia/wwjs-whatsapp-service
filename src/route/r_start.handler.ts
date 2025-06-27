import {LocalHono} from "@/types/LocalHono.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import {WhatsappManage} from "@/lib/whatsapp/manage.ts";
import {sendSuccess} from "@/utils/response-handler.ts";
import {HTTPException} from "hono/http-exception";

const r_startHandler = new LocalHono()

r_startHandler.post("", withClientId(), async (c) => {
    const clientId = c.get("clientId")
    const result = await WhatsappManage(clientId).start()
    switch (result) {
        case "qr" :
            return sendSuccess(c, {
                message: `Success start whatsapp, please scan the qr code in /whatsapp/qr/?clientId:${clientId}`
            })
        case "ready" :
            return sendSuccess(c, {
                message: `Whatsapp clientId ${clientId} start successfully`
            })
        default:
            throw new HTTPException(400, {
                message: `Failed to start whatsapp clientId ${clientId}`
            })
    }
})

export default r_startHandler