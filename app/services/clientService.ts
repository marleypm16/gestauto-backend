import z from "zod";
import { Prisma } from "../generated/prisma";
import prisma from "../plugin/postgres";
import { criarClienteModel } from "../models/criarCliente";

type listarClientes = {
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    nome?: string;
    carro?: string;
    placa?: string;
    email?: string;
    telefone?: string;
    ativo?: boolean;
}
export class ClientService {

    static async getClients(userid:string,empresa_id: string,params: listarClientes) {
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
     const { page, pageSize, sortBy, nome, carro, placa, email, telefone,ativo,sortOrder } = params;
     const skip = (page - 1) * pageSize;
     const take = pageSize;

     // 2. Construção do Filtro Dinâmico ('where')
    const where: Prisma.ClientesWhereInput = {
        empresa_id: empresa_id, // Filtra sempre pela empresa do usuário logado

        // Filtra por campos diretos do Cliente
        ...(nome && { nome: { contains: nome, mode: 'insensitive' } }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
        ...(telefone && { telefone: { contains: telefone, mode: 'insensitive' } }),
        // Correção para o filtro booleano
        ...(ativo !== undefined && { ativo: ativo }),

        // CORREÇÃO: Filtro em dados relacionados (na tabela de Carros)
        ...(placa && {
            carros: {
                some: { // 'some' significa "pelo menos um" carro na lista deve corresponder
                    placa: {
                        contains: placa,
                        mode: 'insensitive'
                    }
                }
            }
        }),
        ...(carro && { // Supondo que 'carro' se refere ao modelo do carro
            carros: {
                some: {
                    modelo: { // Use o nome do campo correto do seu model Carros
                        contains: carro,
                        mode: 'insensitive'
                    }
                }
            }
        })
    };

    // 3. Construção da Ordenação (estava correta)
    const orderBy = {
        [sortBy]: sortOrder
    };
    
    // 4. CORREÇÃO: Usando transação para buscar dados e contagem total
    // Adicionamos 'await' e buscamos a contagem total para a paginação
    const [clientes, totalClientes] = await prisma.$transaction([
        prisma.clientes.findMany({
            where,
            orderBy,
            skip,
            take,
            include: {
                carros: true 
            }
        }),
        prisma.clientes.count({ where })
    ]);

    // 5. CORREÇÃO: Retorna um objeto estruturado com os dados e metadados de paginação
    const totalPages = Math.ceil(totalClientes / pageSize);
    return {
        data: clientes,
        meta: {
            totalItems: totalClientes,
            currentPage: page,
            pageSize,
            totalPages
        }
    };
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
        // 2. Se a permissão for válida, cria o cliente e o associa à empresa e ao funcionário
            const { empresa_id,carros, ...clientData } = data;
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
                    create:carros
                }
                
            }
            });

        return newClient;
    }
}