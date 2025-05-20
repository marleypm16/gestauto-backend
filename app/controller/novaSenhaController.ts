import { FastifyReply, FastifyRequest } from "fastify";
import { NovaSenhaService } from "../services/novaSenhaService";
import novaSenhaModel from "../models/novaSenhaModel";

export class NovaSenhaController{
   private readonly novaSenhaService: NovaSenhaService;

  constructor() {
    this.novaSenhaService = new NovaSenhaService();
  }

     async criarNovaSenha(req:FastifyRequest, res: FastifyReply){
        if (!req.headers.authorization){
           return res.status(500).send({message:"Digite uma otp válida"})
        }
        const otp = req.headers.authorization.split(' ')[1]
        const {novaSenha,email} = novaSenhaModel.parse(req.body)

        await this.novaSenhaService.criarNovaSenha(email,novaSenha,otp)

        return res.status(200).send({message:"Senha alterada com sucesso! Faça login novamente"})
    }
}