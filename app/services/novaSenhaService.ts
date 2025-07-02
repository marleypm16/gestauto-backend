import { redisClient } from "../plugin/redis";
import usuarioSchema from "../schemas/usuarioSchema";
import bcrypt from "bcryptjs";

export class NovaSenhaService{
    async criarNovaSenha(email:string,novaSenha:string){
        //criptografar a nova senha
        const senhaNovaCriptografada = await bcrypt.hash(novaSenha, 12);
        //validar se o usuário existe
        const usuario = await usuarioSchema.findOne({ email });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
       


        if(bcrypt.compareSync(novaSenha, usuario.senha)){
            throw new Error("A nova senha não pode ser igual a senha atual")
        }
        usuario.senha = senhaNovaCriptografada;
        await usuario.save()
    }
}