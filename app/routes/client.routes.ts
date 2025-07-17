import { FastifyInstance } from "fastify";
import { ClientController } from "../controller/clientController";

export const clientRoutes = (app: FastifyInstance) =>{
    app.get('/client',ClientController.getClients);

    app.post('/client', ClientController.createClient);

    app.put('/client/:id',ClientController.updateClient);
}