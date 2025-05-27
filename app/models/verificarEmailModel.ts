import z from "zod";

export const verificarEmailModel = z.object({
    email: z.string().email(),
    otp: z.number().int().min(100000).max(999999)
})