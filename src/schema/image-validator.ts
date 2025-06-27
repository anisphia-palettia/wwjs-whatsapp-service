import {z} from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];

export const imageValidator = z
    .instanceof(File)
    .refine((file) => file.size > 0, {
        message: "File must not be empty",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File size must be at most 5MB",
    })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
        message: "Only .png and .jpg files are allowed",
    });