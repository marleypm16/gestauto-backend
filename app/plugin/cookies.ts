import { FastifyInstance } from "fastify";
import fastifyCookie from "fastify-cookie";
import fp from 'fastify-plugin';

export default fp(async function cookiesPlugin(app: FastifyInstance) {
  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  }
);
})