import { FastifyInstance } from "fastify";
import { CarroController } from "../controller/carroController";

export const carRoutes = (app: FastifyInstance) => {
  app.post(
    '/client/:clientId/carros', 
    CarroController.createCarro 
  );

}