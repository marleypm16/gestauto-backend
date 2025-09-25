import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../plugin/postgres";

export async function validateEmpresaAccess(
  request: FastifyRequest, 
  reply: FastifyReply,
  empresaId: string
): Promise<boolean> {
  try {
    const userId = (request.user as any)?.id;
    
    if (!userId) {
      reply.code(401).send({
        success: false,
        message: "Token de autenticação inválido"
      });
      return false;
    }

    // Verificar se usuário tem acesso à empresa
    const usuarioEmpresa = await prisma.usuarioEmpresa.findFirst({
      where: {
        userId,
        empresaId
      },
      include: {
        empresa: {
          select: { 
            ativo: true,
            status_empresa: true 
          }
        }
      }
    });

    if (!usuarioEmpresa) {
      reply.code(403).send({
        success: false,
        message: "Usuário não tem acesso a esta empresa"
      });
      return false;
    }

    if (!usuarioEmpresa.empresa.ativo) {
      reply.code(403).send({
        success: false,
        message: "Empresa está inativa"
      });
      return false;
    }

    return true;
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      message: "Erro interno do servidor"
    });
    return false;
  }
}