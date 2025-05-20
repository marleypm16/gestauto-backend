import { redisClient } from "../plugin/redis";
import usuarioSchema from "../schemas/usuarioSchema";
import bcrypt from "bcryptjs";

export class NovaSenhaService{
    async criarNovaSenha(email:string,senha:string,otp:string){
        const resultado = await redisClient.get(`otp:${otp}`)
        const senhaNovaCriptografada = await bcrypt.hash(senha, 12);
        if(!resultado){
            console.log("OTP Inválida")
        }

        await usuarioSchema.findOneAndUpdate({
            email
        },{
            $set:{senha : senhaNovaCriptografada }
        })
    }
}