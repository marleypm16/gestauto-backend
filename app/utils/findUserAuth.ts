import { Document } from "mongoose";
import usuarioSchema from "../schemas/usuarioSchema";
import bcrypt from "bcryptjs";
export const findUserAuth = async (email:string,senha:string) => { 
    const user = await usuarioSchema.findOne({email})
    .then((user) => {
        if (!user) {
            return null; 
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha);
        if (!isPasswordValid) {
            return null
        }

        return user; 
    })
    .catch((error) => {
        console.error('Erro ao buscar usuário:', error);
        return null;
    });
   
    return user;

}