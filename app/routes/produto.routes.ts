import { FastifyInstance } from 'fastify';
import produtoController from '../controller/produtoController';

export default async function produtoRoutes(fastify: FastifyInstance) {
  // CRUD básico de produtos com path parameter
  fastify.post('/empresas/:empresaId/produtos', {
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
          nome: { type: 'string', minLength: 2, maxLength: 100 },
          descricao: { type: 'string', maxLength: 500 },
          preco: { type: 'number', minimum: 0.01 },
          estoque_id: { type: 'string', format: 'uuid' }
        },
        required: ['nome', 'preco', 'estoque_id']
      }
    }
  }, produtoController.criarProduto.bind(produtoController));

  fastify.get('/empresas/:empresaId/produtos', {
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
          estoqueId: { type: 'string', format: 'uuid' },
          precoMin: { type: 'number', minimum: 0 },
          precoMax: { type: 'number', minimum: 0 },
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100 }
        }
      }
    }
  }, produtoController.buscarTodosProdutos.bind(produtoController));

  fastify.get('/empresas/:empresaId/produtos/:id', {
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
  }, produtoController.buscarProdutoPorId.bind(produtoController));

  fastify.put('/empresas/:empresaId/produtos/:id', {
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
          nome: { type: 'string', minLength: 2, maxLength: 100 },
          descricao: { type: 'string', maxLength: 500 },
          preco: { type: 'number', minimum: 0.01 },
          estoque_id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, produtoController.atualizarProduto.bind(produtoController));

  fastify.delete('/empresas/:empresaId/produtos/:id', {
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
  }, produtoController.excluirProduto.bind(produtoController));

  // Rotas específicas de produtos com path parameter
  fastify.get('/empresas/:empresaId/estoques/:estoqueId/produtos', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          estoqueId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'estoqueId']
      }
    }
  }, produtoController.buscarProdutosPorEstoque.bind(produtoController));

  fastify.patch('/empresas/:empresaId/produtos/:id/estoque/:estoqueId/quantidade', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' },
          estoqueId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'id', 'estoqueId']
      },
      body: {
        type: 'object',
        properties: {
          quantidade: { type: 'integer', minimum: 0 }
        },
        required: ['quantidade']
      }
    }
  }, produtoController.atualizarQuantidadeEstoque.bind(produtoController));
  
  // Relatórios e estatísticas com path parameter
  fastify.get('/empresas/:empresaId/produtos/estatisticas/geral', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId']
      }
    }
  }, produtoController.obterEstatisticasProdutos.bind(produtoController));
}