import prisma from "../plugin/postgres";

type Produtos = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: any;
  estoque_id: string;
  createdAt: Date;
};

export interface CriarProdutoData {
  nome: string;
  descricao?: string;
  preco: number;
  estoque_id: string;
}

export interface AtualizarProdutoData {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque_id?: string;
}

export interface FiltrosProduto {
  nome?: string;
  estoqueId?: string;
  precoMin?: number;
  precoMax?: number;
}

export interface PaginacaoParams {
  page?: number;
  limit?: number;
}

export interface ProdutoComEstoque extends Produtos {
  estoque: {
    id: string;
    nome: string;
  };
  quantidadeEstoque?: number;
}

class ProdutoService {
  async criarProduto(data: CriarProdutoData): Promise<Produtos> {
    // Verificar se o estoque existe
    const estoqueExiste = await prisma.estoque.findUnique({
      where: { id: data.estoque_id }
    });

    if (!estoqueExiste) {
      throw new Error('Estoque não encontrado');
    }

    // Verificar se já existe produto com mesmo nome no mesmo estoque
    const produtoExistente = await prisma.produtos.findFirst({
      where: {
        nome: data.nome,
        estoque_id: data.estoque_id
      }
    });

    if (produtoExistente) {
      throw new Error('Já existe um produto com esse nome neste estoque');
    }

    const produto = await prisma.produtos.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        estoque_id: data.estoque_id
      }
    });

    // Criar entrada inicial no controle de estoque
    await prisma.produtoEstoque.create({
      data: {
        produtoId: produto.id,
        estoqueId: data.estoque_id,
        quantidade: 0
      }
    });

    return produto;
  }

  async buscarTodosProdutos(
    filtros: FiltrosProduto = {},
    paginacao: PaginacaoParams = {}
  ): Promise<{
    produtos: ProdutoComEstoque[];
    total: number;
    totalPaginas: number;
    paginaAtual: number;
  }> {
    const { page = 1, limit = 10 } = paginacao;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filtros.nome) {
      where.nome = {
        contains: filtros.nome,
        mode: 'insensitive'
      };
    }

    if (filtros.estoqueId) {
      where.estoque_id = filtros.estoqueId;
    }

    if (filtros.precoMin !== undefined || filtros.precoMax !== undefined) {
      where.preco = {};
      if (filtros.precoMin !== undefined) {
        where.preco.gte = filtros.precoMin;
      }
      if (filtros.precoMax !== undefined) {
        where.preco.lte = filtros.precoMax;
      }
    }

    const [produtos, total] = await Promise.all([
      prisma.produtos.findMany({
        where,
        include: {
          estoque: {
            select: {
              id: true,
              nome: true
            }
          },
          ProdutoEstoque: {
            select: {
              quantidade: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          nome: 'asc'
        }
      }),
      prisma.produtos.count({ where })
    ]);

    // Adicionar quantidade total do estoque
    const produtosComEstoque: ProdutoComEstoque[] = produtos.map((produto: any) => ({
      ...produto,
      quantidadeEstoque: produto.ProdutoEstoque.reduce(
        (total: number, pe: any) => total + pe.quantidade, 
        0
      )
    }));

    const totalPaginas = Math.ceil(total / limit);

    return {
      produtos: produtosComEstoque,
      total,
      totalPaginas,
      paginaAtual: page
    };
  }

  async buscarProdutoPorId(id: string): Promise<ProdutoComEstoque | null> {
    const produto = await prisma.produtos.findUnique({
      where: { id },
      include: {
        estoque: {
          select: {
            id: true,
            nome: true
          }
        },
        ProdutoEstoque: {
          select: {
            quantidade: true
          }
        }
      }
    });

    if (!produto) {
      return null;
    }

    return {
      ...produto,
      quantidadeEstoque: produto.ProdutoEstoque.reduce(
        (total: number, pe: any) => total + pe.quantidade, 
        0
      )
    };
  }

  async atualizarProduto(id: string, data: AtualizarProdutoData): Promise<Produtos> {
    // Verificar se o produto existe
    const produtoExiste = await prisma.produtos.findUnique({
      where: { id }
    });

    if (!produtoExiste) {
      throw new Error('Produto não encontrado');
    }

    // Se está mudando o estoque, verificar se existe
    if (data.estoque_id) {
      const estoqueExiste = await prisma.estoque.findUnique({
        where: { id: data.estoque_id }
      });

      if (!estoqueExiste) {
        throw new Error('Estoque não encontrado');
      }
    }

    // Verificar duplicação de nome se estiver mudando nome ou estoque
    if (data.nome || data.estoque_id) {
      const produtoExistente = await prisma.produtos.findFirst({
        where: {
          nome: data.nome || produtoExiste.nome,
          estoque_id: data.estoque_id || produtoExiste.estoque_id,
          id: { not: id }
        }
      });

      if (produtoExistente) {
        throw new Error('Já existe um produto com esse nome neste estoque');
      }
    }

    return await prisma.produtos.update({
      where: { id },
      data
    });
  }

  async excluirProduto(id: string): Promise<void> {
    // Verificar se o produto existe
    const produto = await prisma.produtos.findUnique({
      where: { id }
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Verificar se o produto tem vendas associadas
    const temVendas = await prisma.itemVenda.findFirst({
      where: { produto_id: id }
    });

    if (temVendas) {
      throw new Error('Não é possível excluir produto que possui vendas associadas');
    }

    // Excluir registros de estoque primeiro
    await prisma.produtoEstoque.deleteMany({
      where: { produtoId: id }
    });

    // Excluir o produto
    await prisma.produtos.delete({
      where: { id }
    });
  }

  async buscarProdutosPorEstoque(estoqueId: string): Promise<ProdutoComEstoque[]> {
    const produtos = await prisma.produtos.findMany({
      where: { estoque_id: estoqueId },
      include: {
        estoque: {
          select: {
            id: true,
            nome: true
          }
        },
        ProdutoEstoque: {
          select: {
            quantidade: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    return produtos.map((produto: any) => ({
      ...produto,
      quantidadeEstoque: produto.ProdutoEstoque.reduce(
        (total: number, pe: any) => total + pe.quantidade, 
        0
      )
    }));
  }

  async atualizarQuantidadeEstoque(
    produtoId: string, 
    estoqueId: string, 
    novaQuantidade: number
  ): Promise<void> {
    // Verificar se o produto e estoque existem
    const produto = await prisma.produtos.findUnique({
      where: { id: produtoId }
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const estoque = await prisma.estoque.findUnique({
      where: { id: estoqueId }
    });

    if (!estoque) {
      throw new Error('Estoque não encontrado');
    }

    if (novaQuantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    // Atualizar ou criar registro de estoque
    await prisma.produtoEstoque.upsert({
      where: {
        produtoId_estoqueId: {
          produtoId,
          estoqueId
        }
      },
      update: {
        quantidade: novaQuantidade
      },
      create: {
        produtoId,
        estoqueId,
        quantidade: novaQuantidade
      }
    });
  }

  async obterEstatisticasProdutos(): Promise<{
    totalProdutos: number;
    produtosMaisVendidos: Array<{
      produto: ProdutoComEstoque;
      totalVendido: number;
      faturamento: number;
    }>;
    produtosSemEstoque: ProdutoComEstoque[];
    ticketMedioProdutos: number;
  }> {
    // Total de produtos
    const totalProdutos = await prisma.produtos.count();

    // Produtos mais vendidos (últimos 30 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    const vendas = await prisma.itemVenda.groupBy({
      by: ['produto_id'],
      where: {
        createdAt: {
          gte: dataLimite
        }
      },
      _sum: {
        quantidade: true,
        preco_total: true
      },
      orderBy: {
        _sum: {
          quantidade: 'desc'
        }
      },
      take: 10
    });

    const produtosMaisVendidos = await Promise.all(
      vendas.map(async (venda: any) => {
        const produto = await this.buscarProdutoPorId(venda.produto_id);
        return {
          produto: produto!,
          totalVendido: venda._sum.quantidade || 0,
          faturamento: Number(venda._sum.preco_total || 0)
        };
      })
    );

    // Produtos sem estoque
    const produtosSemEstoque = await prisma.produtos.findMany({
      where: {
        ProdutoEstoque: {
          every: {
            quantidade: 0
          }
        }
      },
      include: {
        estoque: {
          select: {
            id: true,
            nome: true
          }
        },
        ProdutoEstoque: {
          select: {
            quantidade: true
          }
        }
      }
    }).then((produtos: any[]) => 
      produtos.map((produto: any) => ({
        ...produto,
        quantidadeEstoque: produto.ProdutoEstoque.reduce(
          (total: number, pe: any) => total + pe.quantidade, 
          0
        )
      }))
    );

    // Ticket médio dos produtos
    const ticketMedio = await prisma.itemVenda.aggregate({
      _avg: {
        preco_unitario: true
      }
    });

    return {
      totalProdutos,
      produtosMaisVendidos,
      produtosSemEstoque,
      ticketMedioProdutos: Number(ticketMedio._avg.preco_unitario || 0)
    };
  }
}

export default new ProdutoService();