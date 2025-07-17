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
}