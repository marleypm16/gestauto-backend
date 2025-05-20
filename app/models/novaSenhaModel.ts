import {string, z} from "zod"

const novaSenhaModel = z.object({
    novaSenha: string().min(1,{message: "Digite uma nova senha"}).regex(/[a-zA-Z]/, 'A senha deve conter pelo menos uma letra')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial')
})

export default novaSenhaModel