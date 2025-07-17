import { FastifyReply, FastifyRequest } from "fastify";
import { ClientService } from "../services/clientService";
import { criarClienteModel } from "../models/criarCliente";
import { getClientesQuerySchema } from "../models/buscarClientes";

export class ClientController {
    static async getClients(req: FastifyRequest, res: FastifyReply) {
        const params = getClientesQuerySchema.parse(req.query);
        const userId = (req.user as { id: string }).id;
        const {empresa_id,...dados} = params
        const clientes = await ClientService.getClients(userId,empresa_id,dados);
        res.send(clientes);
    }

    static async updateClient(req: any, res: any) {
        const { id } = req.params;
        const data = req.body;
        const updatedClient = await ClientService.updateClient(id, data);
        res.json(updatedClient);
    }

    static async createClient(req: FastifyRequest, res: FastifyReply) {
        const userId = (req.user as { id: string }).id; 
        const data = criarClienteModel.parse(req.body);
        const newClient = await ClientService.createClient(userId,data);
        res.status(201).send(newClient);
    }

}