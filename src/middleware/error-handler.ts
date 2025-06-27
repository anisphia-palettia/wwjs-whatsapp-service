import type {Context} from "hono";
import {ZodError} from "zod";
import {HTTPException} from "hono/http-exception";
import {sendError} from "@/utils/response-handler";
import {appConfig} from "@/config/app.config";

const isDev = appConfig.nodeEnv === "development";

export default function errorHandler(error: any, c: Context) {
    if (error instanceof ZodError) {
        return sendError(c, {
            status: 400,
            message: "Validation error",
            detail: error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }

    if (error instanceof HTTPException) {
        return sendError(c, {
            status: error.status,
            message: `${error.message}` || "HTTP Error",
            ...(isDev && {stack: error.stack}),
        });
    }

    return sendError(c, {
        status: 500,
        message: typeof error?.message === "string" ? `${error.message}` : "Internal Server Error",
        ...(isDev && {stack: error?.stack ?? error}),
    });
}