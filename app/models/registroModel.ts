import z from "zod";
import { criarUsuarioModel } from "./criarUsuario";
import { criarEmpresaModel } from "./criarEmpresa";

export const registroModel = z.object({
    user: criarUsuarioModel,
    company: criarEmpresaModel
})