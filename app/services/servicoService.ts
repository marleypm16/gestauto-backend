import prisma from "../plugin/postgres";

export interface CreateServicoData {
    nome: string;
    descricao?: string;
    preco: number;
    duracao: number; // em minutos
    tempoPosvenda?: number; // em dias
    passoAPasso?: string; // Passo a passo detalhado
    ativo?: boolean;
}

export interface UpdateServicoData {
    nome?: string;
    descricao?: string;
    preco?: number;
    duracao?: number;
    tempoPosvenda?: number;
    passoAPasso?: string; // Passo a passo detalhado
    ativo?: boolean;
}

export class ServicoService {
    async criarServico(data: CreateServicoData) {
        // Verificar se já existe um serviço com o mesmo nome
        const servicoExistente = await prisma.servico.findFirst({
            where: { 
                nome: data.nome,
                deletadoEm: null
            }
        });

        if (servicoExistente) {
            throw new Error("Já existe um serviço com este nome");
        }

        const servico = await prisma.servico.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                duracao: data.duracao,
                tempo_pos_venda: data.tempoPosvenda,
                passoAPasso: data.passoAPasso,
                ativo: data.ativo ?? true
            }
        });

        return servico;
    }

    async buscarTodosServicos(empresaId: string, page: number = 1, limit: number = 10, filtros?: {
        nome?: string;
        passoAPasso?: string;
        ativo?: boolean;
        precoMin?: number;
        precoMax?: number;
        ordenarPor?: 'nome' | 'preco' | 'maisUtilizados' | 'maisLucrativos' | 'recentes';
        ordem?: 'asc' | 'desc';
    }) {
        const skip = (page - 1) * limit;
        
        const where: any = {
            deletadoEm: null,
            empresaId
        };

        if (filtros) {
            if (filtros.nome) {
                where.nome = {
                    contains: filtros.nome,
                    mode: 'insensitive'
                };
            }

            if (filtros.passoAPasso) {
                where.passoAPasso = {
                    contains: filtros.passoAPasso,
                    mode: 'insensitive'
                };
            }

            if (filtros.ativo !== undefined) {
                where.ativo = filtros.ativo;
            }

            if (filtros.precoMin || filtros.precoMax) {
                where.preco = {};
                if (filtros.precoMin) where.preco.gte = filtros.precoMin;
                if (filtros.precoMax) where.preco.lte = filtros.precoMax;
            }
        }

        // Definir ordenação baseada nos parâmetros
        let orderBy: any = { criadoEm: 'desc' }; // Padrão

        if (filtros?.ordenarPor) {
            const ordem = filtros.ordem || 'desc';
            
            switch (filtros.ordenarPor) {
                case 'nome':
                    orderBy = { nome: ordem };
                    break;
                case 'preco':
                    orderBy = { preco: ordem };
                    break;
                case 'recentes':
                    orderBy = { criadoEm: ordem };
                    break;
                case 'maisUtilizados':
                case 'maisLucrativos':
                    // Para estes casos, precisamos buscar primeiro e ordenar depois
                    orderBy = { criadoEm: 'desc' };
                    break;
                default:
                    orderBy = { criadoEm: 'desc' };
            }
        }

        let [servicos, total] = await Promise.all([
            prisma.servico.findMany({
                where,
                skip: filtros?.ordenarPor === 'maisUtilizados' || filtros?.ordenarPor === 'maisLucrativos' ? 0 : skip,
                take: filtros?.ordenarPor === 'maisUtilizados' || filtros?.ordenarPor === 'maisLucrativos' ? undefined : limit,
                include: {
                    _count: {
                        select: { 
                            OrdemServico: true,
                            ItemVenda: true
                        }
                    },
                    OrdemServico: filtros?.ordenarPor === 'maisUtilizados' || filtros?.ordenarPor === 'maisLucrativos' ? {
                        select: {
                            preco_total: true
                        }
                    } : false,
                    ItemVenda: filtros?.ordenarPor === 'maisUtilizados' || filtros?.ordenarPor === 'maisLucrativos' ? {
                        select: {
                            preco_total: true,
                            quantidade: true
                        }
                    } : false
                },
                orderBy
            }),
            prisma.servico.count({ where })
        ]);

        // Aplicar ordenação especial para maisUtilizados e maisLucrativos
        if (filtros?.ordenarPor === 'maisUtilizados' || filtros?.ordenarPor === 'maisLucrativos') {
            const servicosComEstatisticas = servicos.map((servico: any) => {
                const totalUtilizacoesOS = servico._count?.OrdemServico || 0;
                const totalUtilizacoesVenda = servico._count?.ItemVenda || 0;
                const totalUtilizacoes = totalUtilizacoesOS + totalUtilizacoesVenda;

                let totalFaturamento = 0;
                if (servico.OrdemServico && servico.ItemVenda) {
                    const faturamentoOS = servico.OrdemServico.reduce((acc: number, os: any) => acc + Number(os.preco_total), 0);
                    const faturamentoVenda = servico.ItemVenda.reduce((acc: number, item: any) => acc + Number(item.preco_total), 0);
                    totalFaturamento = faturamentoOS + faturamentoVenda;
                }

                return {
                    ...servico,
                    estatisticas: {
                        totalUtilizacoes,
                        totalFaturamento
                    }
                };
            });

            if (filtros.ordenarPor === 'maisUtilizados') {
                servicosComEstatisticas.sort((a, b) => {
                    const ordem = filtros.ordem === 'asc' ? 1 : -1;
                    return (b.estatisticas.totalUtilizacoes - a.estatisticas.totalUtilizacoes) * ordem;
                });
            } else if (filtros.ordenarPor === 'maisLucrativos') {
                servicosComEstatisticas.sort((a, b) => {
                    const ordem = filtros.ordem === 'asc' ? 1 : -1;
                    return (b.estatisticas.totalFaturamento - a.estatisticas.totalFaturamento) * ordem;
                });
            }

            // Aplicar paginação após ordenação
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            servicos = servicosComEstatisticas.slice(startIndex, endIndex);
        }

        return {
            servicos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async buscarServicoPorId(id: string) {
        const servico = await prisma.servico.findFirst({
            where: { 
                id,
                deletadoEm: null
            }
        });

        if (!servico) {
            throw new Error("Serviço não encontrado");
        }

        return servico;
    }

    async atualizarServico(id: string, data: UpdateServicoData) {
        const servicoExistente = await this.buscarServicoPorId(id);

        // Verificar se o nome não está sendo usado por outro serviço
        if (data.nome && data.nome !== servicoExistente.nome) {
            const outroServico = await prisma.servico.findFirst({
                where: { 
                    nome: data.nome,
                    id: { not: id },
                    deletadoEm: null
                }
            });

            if (outroServico) {
                throw new Error("Já existe outro serviço com este nome");
            }
        }

        const servico = await prisma.servico.update({
            where: { id },
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                duracao: data.duracao,
                tempo_pos_venda: data.tempoPosvenda,
                passoAPasso: data.passoAPasso,
                ativo: data.ativo,
                atualizadoEm: new Date()
            }
        });

        return servico;
    }

    async deletarServico(id: string) {
        const servicoExistente = await this.buscarServicoPorId(id);

        // Verificar se o serviço está sendo usado em ordens de serviço
        const ordemServicoComServico = await prisma.ordemServico.findFirst({
            where: { servicoId: id }
        });

        if (ordemServicoComServico) {
            // Soft delete se estiver sendo usado
            await prisma.servico.update({
                where: { id },
                data: { 
                    deletadoEm: new Date(),
                    ativo: false
                }
            });
        } else {
            // Hard delete se não estiver sendo usado
            await prisma.servico.delete({
                where: { id }
            });
        }

        return { message: "Serviço deletado com sucesso" };
    }

    async buscarServicosPorPassoAPasso(busca: string) {
        const servicos = await prisma.servico.findMany({
            where: {
                passoAPasso: {
                    contains: busca,
                    mode: 'insensitive'
                },
                ativo: true,
                deletadoEm: null
            },
            orderBy: { nome: 'asc' }
        });

        return servicos;
    }

    async buscarServicosAtivos() {
        const servicos = await prisma.servico.findMany({
            where: {
                ativo: true,
                deletadoEm: null
            },
            orderBy: { nome: 'asc' }
        });

        return servicos;
    }

    async ativarDesativarServico(id: string, ativo: boolean) {
        const servicoExistente = await this.buscarServicoPorId(id);

        const servico = await prisma.servico.update({
            where: { id },
            data: { 
                ativo,
                atualizadoEm: new Date()
            }
        });

        return {
            message: `Serviço ${ativo ? 'ativado' : 'desativado'} com sucesso`,
            servico
        };
    }

    async obterEstatisticasServicos() {
        const [
            totalServicos,
            servicosAtivos,
            servicosInativos,
            servicoMaisCaro,
            servicoMaisBarato,
            servicosComPassoAPasso
        ] = await Promise.all([
            prisma.servico.count({
                where: { deletadoEm: null }
            }),
            prisma.servico.count({
                where: { ativo: true, deletadoEm: null }
            }),
            prisma.servico.count({
                where: { ativo: false, deletadoEm: null }
            }),
            prisma.servico.findFirst({
                where: { ativo: true, deletadoEm: null },
                orderBy: { preco: 'desc' }
            }),
            prisma.servico.findFirst({
                where: { ativo: true, deletadoEm: null },
                orderBy: { preco: 'asc' }
            }),
            prisma.servico.count({
                where: { 
                    ativo: true, 
                    deletadoEm: null,
                    passoAPasso: { not: null }
                }
            })
        ]);

        return {
            totalServicos,
            servicosAtivos,
            servicosInativos,
            servicoMaisCaro,
            servicoMaisBarato,
            servicosComPassoAPasso
        };
    }

    async duplicarServico(id: string, novoNome: string) {
        const servicoOriginal = await this.buscarServicoPorId(id);

        // Verificar se o novo nome não existe
        const servicoExistente = await prisma.servico.findFirst({
            where: { 
                nome: novoNome,
                deletadoEm: null
            }
        });

        if (servicoExistente) {
            throw new Error("Já existe um serviço com este nome");
        }

        const novoServico = await prisma.servico.create({
            data: {
                nome: novoNome,
                descricao: servicoOriginal.descricao,
                preco: servicoOriginal.preco,
                duracao: servicoOriginal.duracao,
                tempo_pos_venda: servicoOriginal.tempo_pos_venda,
                passoAPasso: servicoOriginal.passoAPasso,
                ativo: true
            }
        });

        return novoServico;
    }

    async buscarServicosPopulares(limite: number = 10) {
        // Buscar serviços mais utilizados nas ordens de serviço
        const servicosPopulares = await prisma.servico.findMany({
            where: {
                ativo: true,
                deletadoEm: null
            },
            include: {
                _count: {
                    select: { OrdemServico: true }
                }
            },
            orderBy: {
                OrdemServico: {
                    _count: 'desc'
                }
            },
            take: limite
        });

        return servicosPopulares;
    }
}
