import {LocalHono} from "@/types/LocalHono.ts";
import c_allHandler from "@/route/chat/c_all.handler.ts";
import c_allGroupsHandler from "@/route/chat/c_all_groups_handler.ts";

const _chat = new LocalHono()

_chat.route("/all", c_allHandler)
_chat.route("/all-groups", c_allGroupsHandler)

export default _chat;