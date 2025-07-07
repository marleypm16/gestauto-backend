import bcrypt from "bcryptjs";
import prisma from "../plugin/postgres";

export class NovaSenhaService{
    async criarNovaSenha(email:string,novaSenha:string){
        //criptografar a nova senha
        const senhaNovaCriptografada = await bcrypt.hash(novaSenha, 12);
        //validar se o usuário existe
        const usuario = await prisma.user.findFirst({ where: { email } });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
       


        if(bcrypt.compareSync(novaSenha, usuario.senha)){
            throw new Error("A nova senha não pode ser igual a senha atual")
        }
        await prisma.user.update({
            where: { id: usuario.id },
            data: { senha: senhaNovaCriptografada }
        });
    }
}