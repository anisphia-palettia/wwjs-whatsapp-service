import {z} from "zod";
import {imageValidator} from "@/schema/image-validator";

export const whatsappMessageSchema = {
    text: z.object({
        text: z.string().min(1),
        recipient: z.string().min(1),
    }),
    withImage: z.object({
        recipient: z.string().min(1),
        caption: z.string().optional(),
        image: imageValidator,
    }),
    broadcast: z.object({
        recipients: z.array(z.string()),
        text: z.string().min(1),
    }),
    broadcastWithImage: z.object({
        recipients: z.array(z.string()),
        caption: z.string().optional(),
        image: imageValidator,
    }),
}

export type WhatsappMessageTextInput = z.infer<typeof whatsappMessageSchema.text>
export type WhatsAppMessageWithImageInput = z.infer<typeof whatsappMessageSchema.withImage>
export type WhatsAppMessageBroadcastInput = z.infer<typeof whatsappMessageSchema.broadcast>
export type WhatsAppMessageBroadcastWithImageInput = z.infer<typeof whatsappMessageSchema.broadcastWithImage>