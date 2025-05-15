import { FastifyReply, FastifyRequest } from "fastify";
import app from "..";
import usuarioSchema from "../schemas/usuarioSchema";
import { criarUsuarioModel } from "../models/criarUsuario";
import { unknown } from "zod";

export class UsuarioController {
  static async getUsuarios(req : FastifyRequest, res : FastifyReply) {
    try {
      return res.status(200).send({ message: "Usuários encontrados com sucesso!" });
    } catch (error) {
      return res.status(500).send({ error: "Erro ao buscar usuários" });
    }
  }
  static async createUsuario(req : FastifyRequest, res : FastifyReply) {
    req.body = criarUsuarioModel.parse(req.body);
    try{
       await usuarioSchema.create(req.body)
       res.status(201).send({ message: "Usuário criado com sucesso!" });
    }
    catch (error: Error | unknown) {
        if(error instanceof Error){
            return res.status(500).send(error.message);
        }
        if(unknown instanceof unknown){
            return res.status(500).send("Erro desconhecido");
        }
    }
  }
}

