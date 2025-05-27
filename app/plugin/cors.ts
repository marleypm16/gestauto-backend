import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import fp from 'fastify-plugin';

export default fp(async function cors(app: FastifyInstance) {
  app.register(fastifyCors, {
     origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  });
})