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
    
    const token = request.cookies.accessToken;
    if (!token) {
        return reply.code(401).send({ 
            success: false,
            error: 'Token não fornecido',
            message: 'Token de acesso não encontrado nos cookies'
        });
    }

    try {
        const decoded = await request.jwtVerify<JWTPayload>();

        const isValid = await verifyToken(token, decoded.id);
        if (!isValid) {
            return reply.code(401).send({ 
                success: false,
                error: 'Token inválido',
                message: 'Token de acesso inválido ou expirado'
            });
        }

        request.user = decoded;
    } catch (error) {
        return reply.code(401).send({ 
            success: false,
            error: 'Token inválido',
            message: 'Erro ao verificar token JWT'
        });
    }
}

export default authMiddleware;
