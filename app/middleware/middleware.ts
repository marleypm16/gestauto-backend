import { FastifyReply, FastifyRequest } from "fastify";
import verifyToken from "../utils/verifyToken";

const authMiddleware = async (request:FastifyRequest, reply:FastifyReply) => {
  
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: 'Token ausente' });

    const token = authHeader.split(' ')[1];
    const decoded = await request.jwtVerify();

    const isValid = await verifyToken(token);
    if (!isValid) {
        return reply.code(401).send({ error: 'Token inválido' });
    }

    
    request.user = decoded;
  
}

export default authMiddleware;
