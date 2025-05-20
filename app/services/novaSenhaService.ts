import { redisClient } from "../plugin/redis";
import usuarioSchema from "../schemas/usuarioSchema";
import bcrypt from "bcryptjs";

export class NovaSenhaService{
    async criarNovaSenha(email:string,novaSenha:string,otp:string){
        //validar se o otp existe no redis
        const resultado = await redisClient.get(`otp:${otp}`)
        
        if(!resultado){
            console.log("OTP Inválida")
        }
        //criptografar a nova senha
        const senhaNovaCriptografada = await bcrypt.hash(novaSenha, 12);
        //validar se o usuário existe
        const usuario = await usuarioSchema.findOne({ email });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        //validar se a senha atual é igual a nova senha

        if(bcrypt.compareSync(novaSenha, usuario.senha)){
            throw new Error("A nova senha não pode ser igual a senha atual")
        }
        usuario.senha = senhaNovaCriptografada;
        await usuario.save()
    }
}