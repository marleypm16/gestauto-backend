import z from "zod";

export const criarClienteModel = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email deve ser válido").optional(),
    telefone: z.string().optional(), 
    carros: z.array(z.object({
        modelo: z.string().min(1, "O modelo do carro é obrigatório"),
        placa: z.string().min(1, "A placa do carro é obrigatória"),
        ano: z.number().int(), 
        marca:z.string().min(1,"Marca do carro é obrigatória"),
        cor: z.string(),
    })).optional(),
    empresa_id: z.string().uuid().min(1, "O ID da empresa é obrigatório"),

})