import {z} from 'zod';

export const criarEmpresaModel = z.object({
    nomeEmpresa: z.string().min(1,{message:"Nome fantasia é obrigatório"}),
    cnpj: z.string().min(1,{message:"CNPJ é obrigatório"}).regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: "CNPJ inválido" }).max(18),
    emailEmpresa: z.string().email().optional(),
    telefoneEmpresa: z.string().optional(),
    endereco: z.object({
        cep: z.string().min(1,{message:"CEP é obrigatório"}).regex(/^\d{5}-\d{3}$/, { message: "CEP inválido" }),
        rua: z.string().min(1,{message:"Rua é obrigatória"}),
        numero: z.string().min(1,{message:"Número é obrigatório"}),
        bairro: z.string().min(1,{message:"Bairro é obrigatório"}),
        cidade: z.string().min(1,{message:"Cidade é obrigatória"}),
        uf: z.string().min(1,{message:"UF é obrigatória"}),
        complemento: z.string().optional(),
    })
})