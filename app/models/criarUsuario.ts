import {z} from 'zod';
import { criarEmpresaModel } from './criarEmpresa';

export const criarUsuarioModel = z.object({

        nomeCompleto: z.string().min(1,{message:"Nome completo é obrigatório"}),
        email: z.string().email({message:"Digite um e-mail válido"}).min(1,{message:"E-mail é obrigatório"}),
        senha: z.string().min(8,{message:"A senha deve ter no mínimo 8 caracteres"}).regex(/[a-zA-Z]/, 'A senha deve conter pelo menos uma letra')
        .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
        .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),

    
})  