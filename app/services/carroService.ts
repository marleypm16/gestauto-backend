import z from "zod";
import criarCarroModel from "../models/criarCarro";
import prisma from "../plugin/postgres";

export class CarroService {
    static async createCarro(cliente_id:string,data: z.infer<typeof criarCarroModel>) {
        const novoCarro = await prisma.carros.create({
            data: {
                ...data,
                cliente:{
                    connect: { id: cliente_id }
                }
            }
        })
        return novoCarro;
    }

    

    static async updateCarro(id: string, clienteId: string, data: any) {
        // Verificar se o carro existe e pertence ao cliente
        const carroExistente = await prisma.carros.findFirst({
            where: {
                id,
                cliente_id: clienteId
            }
        });

        if (!carroExistente) {
            throw new Error('Carro não encontrado ou não pertence ao cliente informado');
        }

        const carroAtualizado = await prisma.carros.update({
            where: { id },
            data,
            include: {
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        });

        return carroAtualizado;
    }

    static async deleteCarro(id: string, clienteId: string) {
        // Verificar se o carro existe e pertence ao cliente
        const carroExistente = await prisma.carros.findFirst({
            where: {
                id,
                cliente_id: clienteId
            }
        });

        if (!carroExistente) {
            throw new Error('Carro não encontrado ou não pertence ao cliente informado');
        }

        await prisma.carros.delete({
            where: { id }
        });

        return { message: 'Carro excluído com sucesso' };
    }

  
}