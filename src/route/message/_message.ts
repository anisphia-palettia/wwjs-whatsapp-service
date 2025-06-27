import {LocalHono} from "@/types/LocalHono.ts";
import m_textHandler from "@/route/message/m_text.handler.ts";
import m_withImageHandler from "@/route/message/m_with-image.handler.ts";
import m_broadcastHandler from "@/route/message/m_broadcast.handler.ts";
import m_broadcastWithImageHandler from "@/route/message/m_broadcast-with-image.handler.ts";

const _message = new LocalHono()

_message.route("/text", m_textHandler) //POST
_message.route("/with-image", m_withImageHandler) //POST
_message.route("/broadcast", m_broadcastHandler) //POST
_message.route("/broadcast-with-image", m_broadcastWithImageHandler) //POST

export default _message