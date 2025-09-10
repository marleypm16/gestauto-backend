import z from "zod";
import { Prisma } from "../generated/prisma";
import prisma from "../plugin/postgres";
import { criarClienteModel } from "../models/criarCliente";

type listarClientes = {
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    // Campo unificado de busca que vai procurar em nome, modelo e placa
    busca?: string;
    // Mantendo os campos específicos caso ainda queira usá-los separadamente
    nome?: string;
    carro?: string;
    placa?: string;
    email?: string;
    telefone?: string;
    ativo?: boolean;
}

export class ClientService {

    static async getClients(userid:string,empresa_id: string,params: listarClientes) {
        console.log("params", params);
        console.log("empresa_id", empresa_id);
        console.log("userid", userid);
        
        const associarEmpresa = await prisma.usuarioEmpresa.findFirst({
            where: {
                userId: userid,
                empresaId: empresa_id
            }
        })
        
        console.log("associarEmpresa", associarEmpresa);
        if (!associarEmpresa) {
            throw new Error("Usuário não tem permissão para criar cliente nesta empresa.");
        }
        
        const { page, pageSize, sortBy, busca, nome, carro, placa, email, telefone, ativo, sortOrder } = params;
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Construção do Filtro Dinâmico ('where')
        const where: Prisma.ClientesWhereInput = {
            empresa_id: empresa_id, // Filtra sempre pela empresa do usuário logado
        };

        // Se há um termo de busca unificado, cria condição OR para buscar em múltiplos campos
        if (busca) {
            where.OR = [
                // Busca no nome do cliente
                {
                    nome: {
                        contains: busca,
                        mode: 'insensitive'
                    }
                },
                // Busca na placa do carro
                {
                    carros: {
                        some: {
                            placa: {
                                contains: busca,
                                mode: 'insensitive'
                            }
                        }
                    }
                },
                // Busca no modelo do carro
                {
                    carros: {
                        some: {
                            modelo: {
                                contains: busca,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            ];
        } else {
            // Mantém os filtros específicos caso não use a busca unificada
            if (nome) {
                where.nome = { contains: nome, mode: 'insensitive' };
            }
            if (placa) {
                where.carros = {
                    ...where.carros,
                    some: {
                        ...((where.carros as any)?.some || {}),
                        placa: {
                            contains: placa,
                            mode: 'insensitive'
                        }
                    }
                };
            }
            if (carro) {
                where.carros = {
                    ...where.carros,
                    some: {
                        ...((where.carros as any)?.some || {}),
                        modelo: {
                            contains: carro,
                            mode: 'insensitive'
                        }
                    }
                };
            }
        }

        

      let orderBy: any = {};
        
        // Ordenações especiais que requerem lógica customizada
        if (sortBy === 'totalGasto' || sortBy === 'numeroAtendimentos') {
            // Para estes casos, vamos ordenar após obter os dados
            orderBy = { nome: sortOrder }; // Ordenação padrão temporária
        } else {
            orderBy = { [sortBy]: sortOrder };
        }
        
        // Usando transação para buscar dados e contagem total
        const [clientes, totalClientes, agregacaoGeral] = await prisma.$transaction([
            prisma.clientes.findMany({
                where,
                orderBy,
                skip,
                take,
                include: {
                    carros: true,
                    OrdemServico:{
                        where:{
                            status: "CONCLUIDA"
                        },
                        select:{
                            preco_total:true
                        }
                    }
                }
            }),
            prisma.clientes.count({ where }),
            prisma.ordemServico.aggregate({
                where: {
                    status: "CONCLUIDA",
                    cliente: where
                },
                _sum: {
                    preco_total: true
                }
            })
        ]);
        
        const totalGastoDecimal = agregacaoGeral._sum.preco_total;
        const totalGastoNaEmpresa = totalGastoDecimal ? totalGastoDecimal.toNumber() : 0;

        const clientesComTotalGasto = clientes.map(cliente => {
            const totalGastoIndividual = cliente.OrdemServico.reduce(
                (soma, os) => soma.add(os.preco_total),
                new Prisma.Decimal(0)
            );
            const { OrdemServico, ...restoDoCliente } = cliente; 
            return {
                ...restoDoCliente,
                totalGasto: totalGastoIndividual.toNumber(),
            };
        });

        // Se a ordenação for por totalGasto ou numeroAtendimentos, aplicamos a ordenação aqui

        let clientesOrdenados = clientesComTotalGasto

        if (sortBy === 'totalGasto') {
            clientesOrdenados = clientesComTotalGasto.sort((a, b) => {
                return sortOrder === 'asc' 
                    ? a.totalGasto - b.totalGasto 
                    : b.totalGasto - a.totalGasto;
            });
        // } else if (sortBy === 'numeroAtendimentos') {
        //     clientesOrdenados = clientesComTotalGasto.sort((a, b) => {
        //         return sortOrder === 'asc' 
        //             ? a.numeroAtendimentos - b.numeroAtendimentos 
        //             : b.numeroAtendimentos - a.numeroAtendimentos;
        //     });
        // }
        }

        const totalPages = Math.ceil(totalClientes / pageSize);
        return {
            data: clientesOrdenados,
            meta: {
                totalItems: totalClientes,
                currentPage: page,
                pageSize,
                totalPages,
                totalGastoNaEmpresa
            }
        };
    }

    static async getClientById(userid: string, clientId: string) {
        const client = await prisma.clientes.findUnique({
            where: { id: clientId },
            include: {
                carros: true,
                empresa: true,
                OrdemServico: true
            }
        });

        return client;
    }

    static async updateClient(id: string, data: any) {
        const updatedClient = await prisma.clientes.update({
            where: { id },
            data: data
        });

        return updatedClient;
    }

    static async createClient(userid: string, data: z.infer<typeof criarClienteModel>) {
        const associarEmpresa = await prisma.usuarioEmpresa.findFirst({
            where: {
                userId: userid,
                empresaId: data.empresa_id
            }
        })
        if (!associarEmpresa) {
            throw new Error("Usuário não tem permissão para criar cliente nesta empresa.");
        }
        
        const { empresa_id, carros, ...clientData } = data;
        const newClient = await prisma.clientes.create({
            data: {
                ...clientData,
                empresa: { 
                    connect: { id: empresa_id }
                },
                funcionario: { 
                    connect: { id: associarEmpresa.id }
                },
                carros:{
                    create: carros
                }
            }
        });

        return newClient;
    }
}