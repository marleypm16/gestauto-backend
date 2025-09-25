import { FastifyReply, FastifyRequest } from "fastify";
import criarCarroModel from "../models/criarCarro";
import { CarroService } from "../services/carroService";
import { validateEmpresaAccess } from "../utils/pathEmpresaValidation";

export class CarroController{
    static async createCarro(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { clientId } = request.params as { clientId: string };
            const { empresaId } = request.params as {  empresaId: string };
            
            
                  ;
                   const userId = (request.user as { id: string }).id;
                  // Validar acesso à empresa
                        if (!userId) {
                            return reply.code(401).send({
                                success: false,
                                message: "Token de autenticação inválido"
                            });
                        }
            
                  
                  const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
                  if (!hasAccess) return; // Resposta já foi enviada
            const data = criarCarroModel.parse(request.body);
            const novoCarro = await CarroService.createCarro(clientId,data);
            return reply.status(201).send(novoCarro);
        } catch (error) {
            return reply.status(500).send(error);
        }
    }


    static async updateCarro(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, clientId, empresaId } = request.params as { id: string; clientId: string; empresaId: string };
            const userId = (request.user as { id: string }).id;
            const data = request.body;
            
            // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
            if (!hasAccess) return;

            const carroAtualizado = await CarroService.updateCarro(id, clientId, data);
            
            return reply.send({
                success: true,
                message: "Carro atualizado com sucesso",
                data: carroAtualizado
            });
        } catch (error: any) {
            return reply.status(400).send({
                success: false,
                message: error.message || "Erro ao atualizar carro"
            });
        }
    }

    static async deleteCarro(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, clientId, empresaId } = request.params as { id: string; clientId: string; empresaId: string };
            const userId = (request.user as { id: string }).id;
            
            // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
            if (!hasAccess) return;

            await CarroService.deleteCarro(id, clientId);
            
            return reply.send({
                success: true,
                message: "Carro excluído com sucesso"
            });
        } catch (error: any) {
            return reply.status(400).send({
                success: false,
                message: error.message || "Erro ao excluir carro"
            });
        }
    }


}