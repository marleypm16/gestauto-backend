import { FastifyReply, FastifyRequest } from "fastify";
import { redisClient } from "../plugin/redis";

async function authMiddleware(request:FastifyRequest, reply:FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: 'Token ausente' });

    const token = authHeader.split(' ')[1];
    const decoded = await request.jwtVerify();

    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return reply.code(401).send({ error: 'Token expirado ou inválido' });
    }

    request.user = decoded;
  } catch (err) {
    reply.code(401).send({ error: 'Token inválido' });
  }
}

export default authMiddleware;
