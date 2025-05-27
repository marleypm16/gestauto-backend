import { FastifyReply, FastifyRequest } from "fastify";
import { criarEmpresaModel } from "../models/criarEmpresa";
import empresaSchema from "../schemas/empresaSchema";

export class EmpresaController {
  static async getEmpresas(req: FastifyRequest, res: FastifyReply) {
    try {
      return res.status(200).send({ message: "Empresas encontradas com sucesso!" });
    } catch (error) {
      return res.status(500).send({ error: "Erro ao buscar empresas" });
    }
  }

  static async createEmpresa(req: FastifyRequest, res: FastifyReply) {
    req.body = criarEmpresaModel.parse(req.body);
    try {
      const novaEmpresa = await empresaSchema.create(req.body);
      res.status(201).send(
        { message: "Empresa criada com sucesso!",
          idEmpresa: novaEmpresa.id,
          
        }

      );
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      }
      
        return res.status(500).send("Erro desconhecido");
      
    }
  }
}