import { FastifyReply, FastifyRequest } from "fastify";
import verifyToken from "../utils/verifyToken";

const authMiddleware = async (request:FastifyRequest, reply:FastifyReply) => {
    
    const token = request.cookies.accessToken || request.headers.authorization?.split(' ')[1]; // Use o nome correto
    if (!token) {
        return reply.code(401).send({ error: 'Token não fornecido' });
    }

    const decoded = await request.jwtVerify();

    const isValid = await verifyToken(token);
    if (!isValid) {
        return reply.code(401).send({ error: 'Token inválido' });
    }

    
    request.user = decoded;
  
}

export default authMiddleware;
