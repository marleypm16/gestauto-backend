import z from "zod";

export const criarClienteModel = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email deve ser válido").optional(),
    telefone: z.string().optional(), 
    empresa_id: z.string().uuid().min(1, "O ID da empresa é obrigatório"),

})