import z from "zod";

export const verificarOtpModel = z.object({
    otp: z.string().min(1, { message: "Digite o OTP" }).regex(/^\d{6}$/, 'O OTP deve conter exatamente 6 dígitos'),
    email: z.string().email({ message: "Digite um e-mail válido" }).min(1, { message: "E-mail é obrigatório" })
})