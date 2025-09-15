import { FastifyReply, FastifyRequest } from "fastify";
import criarCarroModel from "../models/criarCarro";
import { CarroService } from "../services/carroService";

export class CarroController{
    static async createCarro(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { clientId } = request.params as { clientId: string };
            const data = criarCarroModel.parse(request.body);
            const novoCarro = await CarroService.createCarro(clientId,data);
            return reply.status(201).send(novoCarro);
        } catch (error) {
            return reply.status(500).send(error);
        }
    }
}