import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../plugin/postgres';

/**
 * Utilitário para validar acesso do usuário à empresa via path parameter
 */
export async function validateEmpresaAccess(
  request: FastifyRequest, 
  reply: FastifyReply,
  empresaId: string
): Promise<boolean> {
  try {
    const userId = (request.user as any)?.id;
    console.log('Validating access for userId:', userId, 'to empresaId:', empresaId);
    if (!userId) {
      reply.code(401).send({
        success: false,
        message: "Token de autenticação inválido"
      });
      return false;
    }

    
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

/**
 * Extrai empresaId do path e valida acesso
 * Retorna o empresaId se válido, null se inválido (resposta já enviada)
 */
export async function getValidatedEmpresaId(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<string | null> {
  const { empresaId } = request.params as { empresaId: string };
  
  if (!empresaId) {
    reply.code(400).send({
      success: false,
      message: "ID da empresa é obrigatório no path"
    });
    return null;
  }

  const isValid = await validateEmpresaAccess(request, reply, empresaId);
  return isValid ? empresaId : null;
}

/**
 * Middleware que pode ser aplicado em rotas com :empresaId
 * Valida automaticamente o acesso e adiciona empresaId ao request
 */
export async function empresaPathMiddleware(
  request: FastifyRequest & { empresaId?: string },
  reply: FastifyReply
) {
  const empresaId = await getValidatedEmpresaId(request, reply);
  
  if (!empresaId) {
    // Resposta já foi enviada pelo getValidatedEmpresaId
    return;
  }
  
  // Adicionar empresaId validado ao request para uso posterior
  request.empresaId = empresaId;
}