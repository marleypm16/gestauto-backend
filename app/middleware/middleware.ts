import { FastifyReply, FastifyRequest } from "fastify";
import verifyToken from "../utils/verifyToken";

interface JWTPayload {
    id: string;
    email: string;
    nome: string;
    iat: number; // Issued At
    exp: number; // Expiration Time
}

const authMiddleware = async (request:FastifyRequest, reply:FastifyReply) => {
    
    const token = request.headers.authorization?.split(' ')[1] || request.cookies.accessToken ;
    if (!token) {
        return reply.code(401).send({ error: 'Token não fornecido' });
    }

    const decoded = await request.jwtVerify<JWTPayload>();

    const isValid = await verifyToken(token, decoded.id);
    if (!isValid) {
        return reply.code(401).send({ error: 'Token inválido' });
    }

    
    request.user = decoded;
  
}

export default authMiddleware;
