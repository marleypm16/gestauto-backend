import { FastifyRequest, FastifyReply } from 'fastify';
import estoqueService, { CriarEstoqueData, AtualizarEstoqueData, FiltrosEstoque, PaginacaoParams, MovimentacaoEstoque } from '../services/estoqueService';
import { validateEmpresaAccess } from '../utils/pathEmpresaValidation';

class EstoqueController {
  
  async criarEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as CriarEstoqueData;
      const { empresaId } = request.params as {  empresaId: string };
      
      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }
      const { nome } = data;

      // Validações básicas
      if (!nome || nome.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          message: 'Nome do estoque é obrigatório'
        });
      }

      if (nome.trim().length < 2) {
        return reply.status(400).send({
          success: false,
          message: 'Nome do estoque deve ter pelo menos 2 caracteres'
        });
      }
      const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      const estoque = await estoqueService.criarEstoque({
        nome: nome.trim(),
        empresa_id: empresaId
      });

      reply.status(201).send({
        success: true,
        message: 'Estoque criado com sucesso',
        data: estoque
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async buscarTodosEstoques(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
         const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      const {
        nome,
        page = 1,
        limit = 10
      } = query;

      const filtros: FiltrosEstoque = {};
      if (nome) filtros.nome = nome;

      const paginacao: PaginacaoParams = {
        page: Number(page),
        limit: Number(limit)
      };
         
      const resultado = await estoqueService.buscarTodosEstoques(filtros, paginacao, empresaId);

      reply.send({
        success: true,
        message: 'Estoques encontrados',
        data: resultado
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async buscarEstoquePorId(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { id } = params;
     const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada

      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }
      const estoque = await estoqueService.buscarEstoquePorId(id, empresaId);

      if (!estoque) {
        return reply.status(404).send({
          success: false,
          message: 'Estoque não encontrado'
        });
      }

      reply.send({
        success: true,
        message: 'Estoque encontrado',
        data: estoque
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async atualizarEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      const { id } = params;
      const dados = request.body as AtualizarEstoqueData;

      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }

      // Validações dos dados
      if (dados.nome && dados.nome.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          message: 'Nome não pode estar vazio'
        });
      }

      if (dados.nome && dados.nome.trim().length < 2) {
        return reply.status(400).send({
          success: false,
          message: 'Nome deve ter pelo menos 2 caracteres'
        });
      }

      // Limpar dados
      const dadosLimpos: AtualizarEstoqueData = {};
      if (dados.nome) dadosLimpos.nome = dados.nome.trim();

      const estoque = await estoqueService.atualizarEstoque(id, dadosLimpos, empresaId);

      reply.send({
        success: true,
        message: 'Estoque atualizado com sucesso',
        data: estoque
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async excluirEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      const { id } = params;

      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }

      await estoqueService.excluirEstoque(id, empresaId);

      reply.send({
        success: true,
        message: 'Estoque excluído com sucesso'
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async adicionarProdutoAoEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      const params = request.params as any;
      const body = request.body as any;
      const { id: estoqueId } = params;

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }
      const { produtoId, quantidade = 0 } = body;

      if (!estoqueId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (!produtoId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do produto é obrigatório'
        });
      }

      if (quantidade < 0) {
        return reply.status(400).send({
          success: false,
          message: 'Quantidade não pode ser negativa'
        });
      }

      await estoqueService.adicionarProdutoAoEstoque(estoqueId, produtoId, Number(quantidade), empresaId);

      reply.status(201).send({
        success: true,
        message: 'Produto adicionado ao estoque com sucesso'
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async movimentarEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      const { id: estoqueId } = params;
      const { produtoId, tipoMovimentacao, quantidade, observacao } = body;

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }

      if (!estoqueId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (!produtoId) {
        return reply.status(400).send({
          success: false,
          message: 'ID do produto é obrigatório'
        });
      }

      if (!tipoMovimentacao || !['ENTRADA', 'SAIDA', 'AJUSTE'].includes(tipoMovimentacao)) {
        return reply.status(400).send({
          success: false,
          message: 'Tipo de movimentação deve ser ENTRADA, SAIDA ou AJUSTE'
        });
      }

      if (!quantidade || quantidade <= 0) {
        return reply.status(400).send({
          success: false,
          message: 'Quantidade deve ser maior que zero'
        });
      }

      const movimentacao: MovimentacaoEstoque = {
        produtoId,
        estoqueId,
        tipoMovimentacao,
        quantidade: Number(quantidade),
        observacao,
        empresaId
      };

      await estoqueService.movimentarEstoque(movimentacao);

      reply.send({
        success: true,
        message: `Movimentação de ${tipoMovimentacao.toLowerCase()} realizada com sucesso`
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async obterEstatisticasEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }
      const estatisticas = await estoqueService.obterEstatisticasEstoque(empresaId);

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

  async buscarProdutosComEstoqueBaixo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const { limite = 5 } = query;
const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }
      const produtosBaixoEstoque = await estoqueService.buscarProdutosComEstoqueBaixo(Number(limite), empresaId);

      reply.send({
        success: true,
        message: 'Produtos com estoque baixo encontrados',
        data: {
          limite: Number(limite),
          produtos: produtosBaixoEstoque
        }
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async obterResumoEstoque(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as any;
      const { id } = params;
const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
      if (!id) {
        return reply.status(400).send({
          success: false,
          message: 'ID do estoque é obrigatório'
        });
      }

      if (!empresaId) {
        return reply.status(400).send({
          success: false,
          message: 'ID da empresa é obrigatório'
        });
      }
      const estoque = await estoqueService.buscarEstoquePorId(id, empresaId);

      if (!estoque) {
        return reply.status(404).send({
          success: false,
          message: 'Estoque não encontrado'
        });
      }

      // Criar resumo do estoque
      const resumo = {
        id: estoque.id,
        nome: estoque.nome,
        totalProdutos: estoque.totalProdutos,
        quantidadeTotalItens: estoque.quantidadeTotalItens,
        valorTotalEstoque: estoque.valorTotalEstoque,
        produtosSemEstoque: estoque.produtos?.filter(p => p.quantidade === 0).length || 0,
        produtosComEstoqueBaixo: estoque.produtos?.filter(p => p.quantidade > 0 && p.quantidade <= 5).length || 0,
        produtoMaisCaro: estoque.produtos?.reduce((prev, current) => 
          prev.preco > current.preco ? prev : current
        ),
        produtoComMaiorEstoque: estoque.produtos?.reduce((prev, current) => 
          prev.quantidade > current.quantidade ? prev : current
        )
      };

      reply.send({
        success: true,
        message: 'Resumo do estoque obtido com sucesso',
        data: resumo
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}

export default new EstoqueController();