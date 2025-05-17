import { FastifyReply, FastifyRequest } from "fastify";
import verifyToken from "../utils/verifyToken";

const authMiddleware = async (request:FastifyRequest, reply:FastifyReply) => {
  
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: 'Token ausente' });

    const token = authHeader.split(' ')[1];
    const decoded = await request.jwtVerify();

    verifyToken(token).then(() => {
        return reply.code(401).send({ error: 'Token expirado ou inválido' });

    }).catch((error) => {
        console.error('Erro ao verificar token no Redis:', error);
        return reply.code(500).send({ error: 'Erro interno do servidor' });
    })
    ;

  
    
    request.user = decoded;
    reply.code(401).send({ error: 'Token inválido' });
  
}

export default authMiddleware;
