import { FastifyReply, FastifyRequest } from "fastify";
import { criarUsuarioModel } from "../models/criarUsuario";
import { unknown } from "zod";
import prisma from "../plugin/postgres";

export class UsuarioController {
  static async getUsuarios(req : FastifyRequest, res : FastifyReply) {
    try {
      const users = await prisma.user.findMany({})
      return res.status(200).send({ users,message: "Usuários encontrados com sucesso!" });
    } catch (error) {
      return res.status(500).send({ error: "Erro ao buscar usuários" });
    }
  }
  static async createUsuario(req : FastifyRequest, res : FastifyReply) {
    const userData = criarUsuarioModel.parse(req.body);
    
    try{
       await prisma.user.create({
        data:userData,
       })
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

