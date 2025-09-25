import { FastifyInstance } from 'fastify';
import estoqueController from '../controller/estoqueController';

export default async function estoqueRoutes(fastify: FastifyInstance) {
  // CRUD básico de estoques com path parameter
  fastify.post('/empresas/:empresaId/estoques', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 2, maxLength: 100 }
        },
        required: ['nome']
      }
    }
  }, estoqueController.criarEstoque.bind(estoqueController));

  fastify.get('/empresas/:empresaId/estoques', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId']
      },
      querystring: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100 }
        }
      }
    }
  }, estoqueController.buscarTodosEstoques.bind(estoqueController));

  fastify.get('/empresas/:empresaId/estoques/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id']
      }
    }
  }, estoqueController.buscarEstoquePorId.bind(estoqueController));

  fastify.put('/empresas/:empresaId/estoques/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 2, maxLength: 100 }
        }
      }
    }
  }, estoqueController.atualizarEstoque.bind(estoqueController));

  fastify.delete('/empresas/:empresaId/estoques/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id']
      }
    }
  }, estoqueController.excluirEstoque.bind(estoqueController));

  // Gestão de produtos no estoque com path parameter
  fastify.post('/empresas/:empresaId/estoques/:id/produtos', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id']
      },
      body: {
        type: 'object',
        properties: {
          produtoId: { type: 'string', format: 'uuid' },
          quantidade: { type: 'integer', minimum: 0 }
        },
        required: ['produtoId', 'quantidade']
      }
    }
  }, estoqueController.adicionarProdutoAoEstoque.bind(estoqueController));

  fastify.patch('/empresas/:empresaId/estoques/:id/movimentar', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id']
      },
      body: {
        type: 'object',
        properties: {
          produtoId: { type: 'string', format: 'uuid' },
          tipoMovimentacao: { type: 'string', enum: ['ENTRADA', 'SAIDA', 'AJUSTE'] },
          quantidade: { type: 'integer', minimum: 1 },
          observacao: { type: 'string', maxLength: 500 }
        },
        required: ['produtoId', 'tipoMovimentacao', 'quantidade']
      }
    }
  }, estoqueController.movimentarEstoque.bind(estoqueController));

  // Relatórios e estatísticas com path parameter
  fastify.get('/empresas/:empresaId/estoques/estatisticas/geral', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId']
      }
    }
  }, estoqueController.obterEstatisticasEstoque.bind(estoqueController));

  fastify.get('/empresas/:empresaId/estoques/produtos/estoque-baixo', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId']
      },
      querystring: {
        type: 'object',
        properties: {
          limite: { type: 'integer', minimum: 1, maximum: 50 }
        }
      }
    }
  }, estoqueController.buscarProdutosComEstoqueBaixo.bind(estoqueController));

  fastify.get('/empresas/:empresaId/estoques/:id/resumo', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id']
      }
    }
  }, estoqueController.obterResumoEstoque.bind(estoqueController));
}