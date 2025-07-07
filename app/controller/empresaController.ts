import { FastifyReply, FastifyRequest } from "fastify";
import { criarEmpresaModel } from "../models/criarEmpresa";
import { EmpresaService } from "../services/EmpresaService";
import prisma from "../plugin/postgres";


export class EmpresaController {
  
  static async getEmpresas(req: FastifyRequest, res: FastifyReply) {
    try {
      const empresas = await prisma.empresa.findMany({})
      return res.status(200).send({ empresas,message: "Empresas encontradas com sucesso!" });
    } catch (error) {
      return res.status(500).send({ error: "Erro ao buscar empresas" });
    }
  }

  static async getEmpresaUser(req: FastifyRequest, res: FastifyReply) {
    try {
            const userId = (req.user as { id: string }).id; 

           

            // 2. Chama o método estático do seu serviço para buscar as empresas.
            const empresas = await EmpresaService.getUserEmpresas(Number(userId));

            // 3. Envia a resposta de sucesso com o array de empresas.
            //    Se o usuário não tiver empresas, 'empresas' será um array vazio [], o que é uma resposta válida.
            return res.status(200).send({ 
                message: "Empresas do usuário encontradas com sucesso!", 
                data: empresas // Enviando os dados sob a chave 'data'
            });      
      
    } catch (error) {
      return res.status(500).send({ error: "Erro ao buscar empresa" });
    }
  }

 static async createEmpresa(req: FastifyRequest, res: FastifyReply) {
      const userId = (req.user as { id: string }).id; 

      const dadosEmpresa = criarEmpresaModel.parse(req.body);

      const empresaCriada = await prisma.empresa.create({
        data: dadosEmpresa,
      })
      await prisma.usuarioEmpresa.create({
        data: {
          userId: Number(userId), // Obtendo o ID do usuário autenticado
          empresaId: empresaCriada.id, // Supondo que o ID da empresa seja retornado após a criação
          funcao: "Proprietário",
          permisso: "admin",
        },
      })
      res.status(201).send({
        message: "Empresa criada com sucesso!",})
     

  }
}

//usuarioId: (req.user as { id: string }).id, 