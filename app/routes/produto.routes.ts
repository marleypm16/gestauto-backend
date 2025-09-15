import { FastifyInstance } from 'fastify';
import produtoController from '../controller/produtoController';

export default async function produtoRoutes(fastify: FastifyInstance) {
  // CRUD básico de produtos
  fastify.post('/produtos', produtoController.criarProduto.bind(produtoController));
  fastify.get('/produtos', produtoController.buscarTodosProdutos.bind(produtoController));
  fastify.get('/produtos/:id', produtoController.buscarProdutoPorId.bind(produtoController));
  fastify.put('/produtos/:id', produtoController.atualizarProduto.bind(produtoController));
  fastify.delete('/produtos/:id', produtoController.excluirProduto.bind(produtoController));

  // Rotas específicas de produtos
  fastify.get('/produtos/estoque/:estoqueId', produtoController.buscarProdutosPorEstoque.bind(produtoController));
  fastify.patch('/produtos/:id/estoque/:estoqueId', produtoController.atualizarQuantidadeEstoque.bind(produtoController));
  
  // Relatórios e estatísticas
  fastify.get('/produtos/estatisticas/geral', produtoController.obterEstatisticasProdutos.bind(produtoController));
}