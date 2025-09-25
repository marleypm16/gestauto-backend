
import prisma from "../plugin/postgres";

type Estoque = {
  id: string;
  nome: string;
  createdAt: Date;
};

export interface CriarEstoqueData {
  nome: string;
  empresa_id: string;
}

export interface AtualizarEstoqueData {
  nome?: string;
}



export interface EstoqueComDetalhes extends Estoque {
  totalProdutos: number;
  quantidadeTotalItens: number;
  valorTotalEstoque: number;
  produtos?: Array<{
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
    valorTotal: number;
  }>;
}

export interface MovimentacaoEstoque {
  produtoId: string;
  estoqueId: string;
  tipoMovimentacao: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: number;
  observacao?: string;
  empresaId: string;
}

export interface FiltrosEstoque {
  nome?: string;
  descricao?: string;
}

export interface PaginacaoParams {
  page?: number;
  limit?: number;
}

class EstoqueService {
    async criarEstoque(data: CriarEstoqueData): Promise<Estoque> {
        const estoqueExistente = await prisma.estoque.findFirst({
            where: { 
                nome: {
                    equals: data.nome.trim(),
                    mode: 'insensitive'
                }
            }
        });
        if (estoqueExistente) {
            throw new Error("Já existe um estoque com esse nome");
        }
        return await prisma.estoque.create({
            data: {
                nome: data.nome.trim(),
                empresa_id: data.empresa_id
            }
        });
    }

    async buscarTodosEstoques(
        filtros: FiltrosEstoque = {},
        paginacao: PaginacaoParams = {},
        empresaId: string
    ): Promise<{
        estoques: EstoqueComDetalhes[];
        total: number;
        totalPaginas: number;
        paginaAtual: number;
    }> {
        const { page = 1, limit = 10 } = paginacao;
        const skip = (page - 1) * limit;

        const where: any = {
            empresa_id: empresaId // Filtrar por empresa
        };

        if (filtros.nome) {
            where.nome = {
                contains: filtros.nome,
                mode: 'insensitive'
            };
        }

        const [estoques, total] = await Promise.all([
            prisma.estoque.findMany({
                where,
                include: {
                    ProdutoEstoque: {
                        include: {
                            produto: {
                                select: {
                                    id: true,
                                    nome: true,
                                    preco: true
                                }
                            }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    nome: 'asc'
                }
            }),
            prisma.estoque.count({ where })
        ]);

        // Calcular detalhes de cada estoque
        const estoquesComDetalhes: EstoqueComDetalhes[] = estoques.map((estoque: any) => {
            const produtos = estoque.ProdutoEstoque.map((pe: any) => ({
                id: pe.produto.id,
                nome: pe.produto.nome,
                preco: Number(pe.produto.preco),
                quantidade: pe.quantidade,
                valorTotal: pe.quantidade * Number(pe.produto.preco)
            }));

            const totalProdutos = produtos.length;
            const quantidadeTotalItens = produtos.reduce((total: number, p: any) => total + p.quantidade, 0);
            const valorTotalEstoque = produtos.reduce((total: number, p: any) => total + p.valorTotal, 0);

            return {
                id: estoque.id,
                nome: estoque.nome,
                createdAt: estoque.createdAt,
                totalProdutos,
                quantidadeTotalItens,
                valorTotalEstoque,
                produtos
            };
        });

        const totalPaginas = Math.ceil(total / limit);

        return {
            estoques: estoquesComDetalhes,
            total,
            totalPaginas,
            paginaAtual: page
        };
    }

    async buscarEstoquePorId(id: string, empresaId: string): Promise<EstoqueComDetalhes | null> {
        const estoque = await prisma.estoque.findFirst({
            where: { 
                id,
                empresa_id: empresaId 
            },
            include: {
                ProdutoEstoque: {
                    include: {
                        produto: {
                            select: {
                                id: true,
                                nome: true,
                                preco: true
                            }
                        }
                    }
                }
            }
        });

        if (!estoque) {
            return null;
        }

        const produtos = estoque.ProdutoEstoque.map((pe: any) => ({
            id: pe.produto.id,
            nome: pe.produto.nome,
            preco: Number(pe.produto.preco),
            quantidade: pe.quantidade,
            valorTotal: pe.quantidade * Number(pe.produto.preco)
        }));

        const totalProdutos = produtos.length;
        const quantidadeTotalItens = produtos.reduce((total: number, p: any) => total + p.quantidade, 0);
        const valorTotalEstoque = produtos.reduce((total: number, p: any) => total + p.valorTotal, 0);

        return {
            id: estoque.id,
            nome: estoque.nome,
            createdAt: estoque.createdAt,
            totalProdutos,
            quantidadeTotalItens,
            valorTotalEstoque,
            produtos
        };
    }

    async atualizarEstoque(id: string, data: AtualizarEstoqueData, empresaId: string): Promise<Estoque> {
        // Verificar se o estoque existe e pertence à empresa
        const estoqueExiste = await prisma.estoque.findFirst({
            where: { 
                id,
                empresa_id: empresaId 
            }
        });

        if (!estoqueExiste) {
            throw new Error('Estoque não encontrado');
        }

        // Verificar duplicação de nome se estiver mudando
        if (data.nome) {
            const estoqueExistente = await prisma.estoque.findFirst({
                where: {
                    nome: {
                        equals: data.nome.trim(),
                        mode: 'insensitive'
                    },
                    id: { not: id }
                }
            });

            if (estoqueExistente) {
                throw new Error('Já existe um estoque com esse nome');
            }
        }

        return await prisma.estoque.update({
            where: { id },
            data: {
                nome: data.nome?.trim()
            }
        });
    }

    async excluirEstoque(id: string, empresaId: string): Promise<void> {
        // Verificar se o estoque existe e pertence à empresa
        const estoque = await prisma.estoque.findFirst({
            where: { 
                id,
                empresa_id: empresaId 
            }
        });

        if (!estoque) {
            throw new Error('Estoque não encontrado');
        }

        // Verificar se há produtos vinculados ao estoque
        const produtosVinculados = await prisma.produtos.findFirst({
            where: { estoque_id: id }
        });

        if (produtosVinculados) {
            throw new Error('Não é possível excluir estoque que possui produtos vinculados');
        }

        // Verificar se há registros de controle de estoque
        const registrosEstoque = await prisma.produtoEstoque.findFirst({
            where: { estoqueId: id }
        });

        if (registrosEstoque) {
            throw new Error('Não é possível excluir estoque que possui movimentações registradas');
        }

        await prisma.estoque.delete({
            where: { id }
        });
    }

    async adicionarProdutoAoEstoque(
        estoqueId: string, 
        produtoId: string, 
        quantidade: number = 0,
        empresaId: string
    ): Promise<void> {
        // Verificar se o estoque existe e pertence à empresa
        const estoque = await prisma.estoque.findFirst({
            where: { 
                id: estoqueId,
                empresa_id: empresaId 
            }
        });

        if (!estoque) {
            throw new Error('Estoque não encontrado ou você não tem permissão para acessá-lo');
        }

        // Verificar se o produto existe e pertence à empresa
        const produto = await prisma.produtos.findFirst({
            where: { 
                id: produtoId,
                empresa_id: empresaId 
            }
        });

        if (!produto) {
            throw new Error('Produto não encontrado ou você não tem permissão para acessá-lo');
        }

        if (quantidade < 0) {
            throw new Error('Quantidade não pode ser negativa');
        }

        // Verificar se o produto já está no estoque
        const produtoNoEstoque = await prisma.produtoEstoque.findUnique({
            where: {
                produtoId_estoqueId: {
                    produtoId,
                    estoqueId
                }
            }
        });

        if (produtoNoEstoque) {
            throw new Error('Produto já está vinculado a este estoque');
        }

        await prisma.produtoEstoque.create({
            data: {
                produtoId,
                estoqueId,
                quantidade
            }
        });
    }

    async movimentarEstoque(movimentacao: MovimentacaoEstoque): Promise<void> {
        const { produtoId, estoqueId, tipoMovimentacao, quantidade, empresaId } = movimentacao;

        if (quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        // Verificar se o produto e estoque pertencem à empresa
        const produto = await prisma.produtos.findFirst({
            where: { 
                id: produtoId,
                empresa_id: empresaId 
            }
        });

        if (!produto) {
            throw new Error('Produto não encontrado ou você não tem permissão para acessá-lo');
        }

        const estoque = await prisma.estoque.findFirst({
            where: { 
                id: estoqueId,
                empresa_id: empresaId 
            }
        });

        if (!estoque) {
            throw new Error('Estoque não encontrado ou você não tem permissão para acessá-lo');
        }

        const produtoNoEstoque = await prisma.produtoEstoque.findUnique({
            where: {
                produtoId_estoqueId: {
                    produtoId,
                    estoqueId
                }
            }
        });

        if (!produtoNoEstoque) {
            throw new Error('Produto não encontrado neste estoque');
        }

        let novaQuantidade = produtoNoEstoque.quantidade;

        switch (tipoMovimentacao) {
            case 'ENTRADA':
                novaQuantidade += quantidade;
                break;
            case 'SAIDA':
                if (produtoNoEstoque.quantidade < quantidade) {
                    throw new Error('Quantidade insuficiente em estoque');
                }
                novaQuantidade -= quantidade;
                break;
            case 'AJUSTE':
                novaQuantidade = quantidade;
                break;
        }

        await prisma.produtoEstoque.update({
            where: {
                produtoId_estoqueId: {
                    produtoId,
                    estoqueId
                }
            },
            data: {
                quantidade: novaQuantidade
            }
        });
    }

    async obterEstatisticasEstoque(empresaId: string): Promise<{
        totalEstoques: number;
        estoqueMaisValioso: EstoqueComDetalhes | null;
        estoqueComMaisProdutos: EstoqueComDetalhes | null;
        valorTotalTodosEstoques: number;
        produtosSemEstoque: Array<{
            id: string;
            nome: string;
            preco: number;
        }>;
        estoquesBaixos: Array<{
            estoque: string;
            produto: string;
            quantidade: number;
            limite?: number;
        }>;
    }> {
        const totalEstoques = await prisma.estoque.count({
            where: { empresa_id: empresaId }
        });

        // Buscar todos os estoques com detalhes
        const todosEstoques = await this.buscarTodosEstoques({}, { page: 1, limit: 1000 }, empresaId);

        let estoqueMaisValioso: EstoqueComDetalhes | null = null;
        let estoqueComMaisProdutos: EstoqueComDetalhes | null = null;
        let valorTotalTodosEstoques = 0;

        if (todosEstoques.estoques.length > 0) {
            estoqueMaisValioso = todosEstoques.estoques.reduce((prev: any, current: any) =>
                prev.valorTotalEstoque > current.valorTotalEstoque ? prev : current
            );

            estoqueComMaisProdutos = todosEstoques.estoques.reduce((prev: any, current: any) =>
                prev.totalProdutos > current.totalProdutos ? prev : current
            );

            valorTotalTodosEstoques = todosEstoques.estoques.reduce(
                (total: number, estoque: any) => total + estoque.valorTotalEstoque,
                0
            );
        }        // Produtos sem estoque (não vinculados a nenhum estoque)
        const produtosSemEstoque = await prisma.produtos.findMany({
            where: {
                ProdutoEstoque: {
                    none: {}
                }
            },
            select: {
                id: true,
                nome: true,
                preco: true
            }
        }).then((produtos: any[]) => 
            produtos.map((produto: any) => ({
                id: produto.id,
                nome: produto.nome,
                preco: Number(produto.preco)
            }))
        );

        // Estoques baixos (quantidade <= 5)
        const estoquesBaixos = await prisma.produtoEstoque.findMany({
            where: {
                quantidade: {
                    lte: 5
                }
            },
            include: {
                produto: {
                    select: {
                        nome: true
                    }
                },
                estoque: {
                    select: {
                        nome: true
                    }
                }
            }
        }).then((registros: any[]) => 
            registros.map((registro: any) => ({
                estoque: registro.estoque.nome,
                produto: registro.produto.nome,
                quantidade: registro.quantidade,
                limite: 5
            }))
        );

        return {
            totalEstoques,
            estoqueMaisValioso,
            estoqueComMaisProdutos,
            valorTotalTodosEstoques,
            produtosSemEstoque,
            estoquesBaixos
        };
    }

    async buscarProdutosComEstoqueBaixo(limite: number = 5, empresaId: string): Promise<Array<{
        produto: {
            id: string;
            nome: string;
            preco: number;
        };
        estoque: {
            id: string;
            nome: string;
        };
        quantidade: number;
    }>> {
        const produtosBaixoEstoque = await prisma.produtoEstoque.findMany({
            where: {
                quantidade: {
                    lte: limite
                },
                AND: [
                    {
                        produto: {
                            empresa_id: empresaId
                        }
                    },
                    {
                        estoque: {
                            empresa_id: empresaId
                        }
                    }
                ]
            },
            include: {
                produto: {
                    select: {
                        id: true,
                        nome: true,
                        preco: true
                    }
                },
                estoque: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            },
            orderBy: {
                quantidade: 'asc'
            }
        });

        return produtosBaixoEstoque.map((item: any) => ({
            produto: {
                id: item.produto.id,
                nome: item.produto.nome,
                preco: Number(item.produto.preco)
            },
            estoque: {
                id: item.estoque.id,
                nome: item.estoque.nome
            },
            quantidade: item.quantidade
        }));
    }
}

export default new EstoqueService();