import {LocalHono} from "@/types/LocalHono.ts";
import r_startHandler from "@/route/r_start.handler.ts";
import r_qrHandler from "@/route/r_qr.handler.ts";
import _message from "@/route/message/_message.ts";
import _chat from "@/route/chat/_chat.ts";

const _index = new LocalHono()

_index.route("/message", _message)
_index.route("/chat", _chat)

_index.route("/start", r_startHandler) //POST
_index.route("/qr", r_qrHandler) //POST

export default _index