import {LocalHono} from "@/types/LocalHono.ts";
import errorHandler from "@/middleware/error-handler.ts";
import _index from "@/route/_index.ts";

const app = new LocalHono();

app.route("/", _index)
app.onError(errorHandler)

export default app