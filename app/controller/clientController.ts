import { FastifyReply, FastifyRequest } from "fastify";
import { ClientService } from "../services/clientService";
import { criarClienteModel } from "../models/criarCliente";
import { getClientesQuerySchema } from "../models/buscarClientes";
import { validateEmpresaAccess } from "../utils/pathEmpresaValidation";

export class ClientController {
    

    static async getClients(req: FastifyRequest, res: FastifyReply) {
        try {
            const { empresaId } = req.params as { empresaId: string };
            const userId = (req.user as { id: string }).id;
            
            // Validar acesso à empresa
            if (!userId) {
                return res.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const hasAccess = await validateEmpresaAccess(req, res, empresaId);
            if (!hasAccess) return; // Resposta já foi enviada

            // Processar query parameters
            const params = getClientesQuerySchema.parse(req.query);
            
            const clientes = await ClientService.getClients(userId, empresaId, params);
            
            res.send({
                success: true,
                data: clientes
            });
        } catch (error: any) {
            res.code(500).send({
                success: false,
                message: error.message || "Erro interno do servidor"
            });
        }
    }

    static async getClientById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id, empresaId } = req.params as { id: string; empresaId: string };
            const userId = (req.user as { id: string }).id;
            
            // Validar acesso à empresa
            if (!userId) {
                return res.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const hasAccess = await validateEmpresaAccess(req, res, empresaId);
            if (!hasAccess) return; // Resposta já foi enviada

            const client = await ClientService.getClientById(userId, id);
            
            res.send({
                success: true,
                data: client
            });
        } catch (error: any) {
            res.code(500).send({
                success: false,
                message: error.message || "Erro interno do servidor"
            });
        }
    }

    static async updateClient(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id, empresaId } = req.params as { id: string; empresaId: string };
            const userId = (req.user as { id: string }).id;
            const data = req.body;
            
            // Validar acesso à empresa
            if (!userId) {
                return res.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const hasAccess = await validateEmpresaAccess(req, res, empresaId);
            if (!hasAccess) return; // Resposta já foi enviada

            const updatedClient = await ClientService.updateClient(id, data);
            
            res.send({
                success: true,
                message: "Cliente atualizado com sucesso",
                data: updatedClient
            });
        } catch (error: any) {
            res.code(500).send({
                success: false,
                message: error.message || "Erro interno do servidor"
            });
        }
    }

    static async createClient(req: FastifyRequest, res: FastifyReply) {
        try {
            const { empresaId } = req.params as { empresaId: string };
            const userId = (req.user as { id: string }).id; 
            const data = criarClienteModel.parse(req.body);
            
            // Validar acesso à empresa
            if (!userId) {
                return res.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const hasAccess = await validateEmpresaAccess(req, res, empresaId);
            if (!hasAccess) return; // Resposta já foi enviada

            // Criar cliente associado à empresa
            const newClient = await ClientService.createClient(userId, {
                ...data,
                empresa_id: empresaId
            });
            
            res.status(201).send({
                success: true,
                message: "Cliente criado com sucesso",
                data: newClient
            });
        } catch (error: any) {
            res.code(400).send({
                success: false,
                message: error.message || "Erro ao criar cliente"
            });
        }
    }

}