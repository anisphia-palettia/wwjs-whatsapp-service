import {LocalHono} from "@/types/LocalHono.ts";
import {withClientId} from "@/middleware/with-client-id.ts";
import {WhatsappQr} from "@/lib/whatsapp/qr.ts";
import {sendSuccess} from "@/utils/response-handler.ts";

const r_qrHandler = new LocalHono()

r_qrHandler.get("", withClientId(), async (c) => {
    const clientId = c.get("clientId")
    const qr = WhatsappQr(clientId).getQr()
    return sendSuccess(c, {
        message: "Success get qr code",
        data: {
            qr: `https://quickchart.io/qr?text=${encodeURIComponent(qr)}`
        }
    })
})

export default r_qrHandler