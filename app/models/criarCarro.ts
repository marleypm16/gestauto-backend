import z from "zod";

const criarCarroModel = z.object({
    modelo: z.string().min(1, "O modelo do carro é obrigatório"),
    placa: z.string().min(1, "A placa do carro é obrigatória"),
    ano: z.number().int().min(1886, "O ano do carro deve ser um número válido").max(new Date().getFullYear(), "O ano do carro não pode ser no futuro"),
    marca: z.string().min(1, "A marca do carro é obrigatória"),
    cor: z.string(),
})

export default criarCarroModel;