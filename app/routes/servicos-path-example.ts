import { FastifyInstance } from 'fastify';
import { ServicoController } from '../controller/servicoController';

/**
 * ✅ EXEMPLO DE ROTAS COM PATH PARAMETER
 * Padrão: /api/v1/empresas/:empresaId/recurso
 */
export async function servicoRoutesWithPath(fastify: FastifyInstance) {
  
  const servicoController = new ServicoController();
  
  // 🎯 ROTAS COM EMPRESA NO PATH - Aplicar este padrão
  
  // Criar serviço para uma empresa específica
  // POST /api/v1/empresas/123e4567-e89b-12d3-a456-426614174000/servicos
  fastify.post('/empresas/:empresaId/servicos', {
    // Schema para validação do path parameter
    schema: {
      params: {
        type: 'object',
        required: ['empresaId'],
        properties: {
          empresaId: { 
            type: 'string',
            format: 'uuid',
            description: 'ID da empresa (UUID)' 
          }
        }
      },
      body: {
        type: 'object',
        required: ['nome', 'preco', 'duracao'],
        properties: {
          nome: { type: 'string', minLength: 1 },
          preco: { type: 'number', minimum: 0.01 },
          duracao: { type: 'number', minimum: 1 },
          descricao: { type: 'string' },
          ativo: { type: 'boolean', default: true }
        }
      }
    }
  }, servicoController.criarServicoComPath);

  // Listar serviços de uma empresa
  // GET /api/v1/empresas/123e4567-e89b-12d3-a456-426614174000/servicos
  fastify.get('/empresas/:empresaId/servicos', {
    schema: {
      params: {
        type: 'object',
        required: ['empresaId'],
        properties: {
          empresaId: { type: 'string', format: 'uuid' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          nome: { type: 'string' },
          ativo: { type: 'boolean' }
        }
      }
    }
  }, async (request: any, reply: any) => {
    // Exemplo de implementação - você adaptaria seu método existente
    const { empresaId } = request.params;
    const query = request.query;
    
    // Reutilizar a lógica do método existente, mas com empresaId do path
    // const resultado = await servicoController.buscarTodosServicos_adaptado(empresaId, query);
    
    reply.send({
      success: true,
      message: "Implementar buscarTodosServicos com empresaId do path",
      empresaId,
      query
    });
  });

  // Buscar serviço específico
  // GET /api/v1/empresas/123e4567-e89b-12d3-a456-426614174000/servicos/456e7890-e12b-34c5-d678-901234567890
  fastify.get('/empresas/:empresaId/servicos/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['empresaId', 'servicoId'],
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          servicoId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request: any, reply: any) => {
    const { empresaId, servicoId } = request.params;
    
    reply.send({
      success: true,
      message: "Implementar buscarServicoPorId com empresaId do path",
      empresaId,
      servicoId
    });
  });

  // Atualizar serviço
  // PUT /api/v1/empresas/123e4567-e89b-12d3-a456-426614174000/servicos/456e7890-e12b-34c5-d678-901234567890
  fastify.put('/empresas/:empresaId/servicos/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['empresaId', 'servicoId'],
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          servicoId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request: any, reply: any) => {
    const { empresaId, servicoId } = request.params;
    const data = request.body;
    
    reply.send({
      success: true,
      message: "Implementar atualizarServico com empresaId do path",
      empresaId,
      servicoId,
      data
    });
  });

  // Deletar serviço
  // DELETE /api/v1/empresas/123e4567-e89b-12d3-a456-426614174000/servicos/456e7890-e12b-34c5-d678-901234567890
  fastify.delete('/empresas/:empresaId/servicos/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['empresaId', 'servicoId'],
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          servicoId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request: any, reply: any) => {
    const { empresaId, servicoId } = request.params;
    
    reply.send({
      success: true,
      message: "Implementar deletarServico com empresaId do path",
      empresaId,
      servicoId
    });
  });
}

/**
 * 📋 COMO USAR NO FRONTEND:
 * 
 * // ✅ URLs claras e RESTful
 * const criarServico = async (empresaId, dadosServico) => {
 *   const response = await fetch(`/api/v1/empresas/${empresaId}/servicos`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${token}`
 *     },
 *     body: JSON.stringify(dadosServico)
 *   });
 * };
 * 
 * const listarServicos = async (empresaId, filtros = {}) => {
 *   const params = new URLSearchParams(filtros);
 *   const response = await fetch(`/api/v1/empresas/${empresaId}/servicos?${params}`);
 * };
 * 
 * const buscarServico = async (empresaId, servicoId) => {
 *   const response = await fetch(`/api/v1/empresas/${empresaId}/servicos/${servicoId}`);
 * };
 */