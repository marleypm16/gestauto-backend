import { FastifyRequest, FastifyReply } from 'fastify';
import produtoService, { CriarProdutoData, AtualizarProdutoData, FiltrosProduto, PaginacaoParams } from '../services/produtoService';

class ProdutoController {
  async criarProduto(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as CriarProdutoData;
      const { nome, descricao, preco, estoque_id } = data;

      // Validações básicas
      if (!nome || nome.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          message: 'Nome do produto é obrigatório'
        });
      }

      if (!preco || preco <= 0) {
        return reply.status(400).send({
          success: false,
          message: 'Preço deve ser maior que zero'
        });
      }

      if (!estoque_id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      const produto = await produtoService.criarProduto({
        nome: nome.trim(),
        descricao: descricao?.trim(),
        preco: Number(preco),
        estoque_id
      });

      reply.status(201).send({
        success: true,
        message: 'Produto criado com sucesso',
        data: produto
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async buscarTodosProdutos(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const {
        nome,
        estoqueId,
        precoMin,
        precoMax,
        page = 1,
        limit = 10
      } = query;

      const filtros: FiltrosProduto = {};
      
      if (nome) filtros.nome = nome;
      if (estoqueId) filtros.estoqueId = estoqueId;
      if (precoMin) filtros.precoMin = Number(precoMin);
      if (precoMax) filtros.precoMax = Number(precoMax);

      const paginacao: PaginacaoParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const resultado = await produtoService.buscarTodosProdutos(filtros, paginacao);

      reply.send({
        success: true,
        message: 'Produtos encontrados',
        data: resultado
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async buscarProdutoPorId(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { id } = params;

      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do produto é obrigatório'
        });
      }

      const produto = await produtoService.buscarProdutoPorId(id);

      if (!produto) {
        return reply.status(404).send({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      reply.send({
        success: true,
        message: 'Produto encontrado',
        data: produto
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async atualizarProduto(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { id } = params;
      const dados = request.body as AtualizarProdutoData;

      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do produto é obrigatório'
        });
      }

      // Validações dos dados
      if (dados.nome && dados.nome.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          message: 'Nome não pode estar vazio'
        });
      }

      if (dados.preco !== undefined && dados.preco <= 0) {
        return reply.status(400).send({
          success: false,
          message: 'Preço deve ser maior que zero'
        });
      }

      // Limpar dados
      const dadosLimpos: AtualizarProdutoData = {};
      if (dados.nome) dadosLimpos.nome = dados.nome.trim();
      if (dados.descricao !== undefined) dadosLimpos.descricao = dados.descricao?.trim();
      if (dados.preco !== undefined) dadosLimpos.preco = Number(dados.preco);
      if (dados.estoque_id) dadosLimpos.estoque_id = dados.estoque_id;

      const produto = await produtoService.atualizarProduto(id, dadosLimpos);

      reply.send({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: produto
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async excluirProduto(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { id } = params;

      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do produto é obrigatório'
        });
      }

      await produtoService.excluirProduto(id);

      reply.send({
        success: true,
        message: 'Produto excluído com sucesso'
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async buscarProdutosPorEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { estoqueId } = params;

      if (!estoqueId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      const produtos = await produtoService.buscarProdutosPorEstoque(estoqueId);

      reply.send({
        success: true,
        message: 'Produtos encontrados',
        data: produtos
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async atualizarQuantidadeEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const { id: produtoId, estoqueId } = params;
      const { quantidade } = body;

      if (!produtoId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do produto é obrigatório'
        });
      }

      if (!estoqueId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (quantidade === undefined || quantidade < 0) {
        return reply.status(400).send({
          success: false,
          message: 'Quantidade deve ser um número não negativo'
        });
      }

      await produtoService.atualizarQuantidadeEstoque(produtoId, estoqueId, Number(quantidade));

      reply.send({
        success: true,
        message: 'Quantidade do estoque atualizada com sucesso'
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async obterEstatisticasProdutos(request: FastifyRequest, reply: FastifyReply) {
    try {
      const estatisticas = await produtoService.obterEstatisticasProdutos();

      reply.send({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: estatisticas
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}

export default new ProdutoController();