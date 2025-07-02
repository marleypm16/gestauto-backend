import { FastifyReply, FastifyRequest } from "fastify";
import { NovaSenhaService } from "../services/novaSenhaService";
import novaSenhaModel from "../models/novaSenhaModel";

export class NovaSenhaController{
   private readonly novaSenhaService: NovaSenhaService;

  constructor() {
    this.novaSenhaService = new NovaSenhaService();
  }

     async criarNovaSenha(req:FastifyRequest, res: FastifyReply){
  
        const {novaSenha,email} = novaSenhaModel.parse(req.body)

        await this.novaSenhaService.criarNovaSenha(email,novaSenha)

        return res.status(200).send({message:"Senha alterada com sucesso! Faça login novamente"})
    }
    
}