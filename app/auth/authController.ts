import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginModel } from "../models/loginModel";
import { redisClient } from "../plugin/redis";
import { findUserAuth } from "../utils/findUserAuth";
import { criarUsuarioModel } from "../models/criarUsuario";
import usuarioSchema from "../schemas/usuarioSchema";
import { unknown } from "zod";
import bcrypt from "bcryptjs";
import { error } from "console";

export class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
      const {email,senha} = loginModel.parse(request.body);

      // Busca o usuário no banco de dados
      const user = await findUserAuth(email, senha);
      
      if (!user) {
        return reply.status(401).send({ message: 'E-mail ou senha inválidos' });
      }

      // Gerar token JWT com mais dados do usuário
      const token = request.server.jwt.sign({ 
        id: user.id, 
        email: user.email,
      });

      // Armazenar sessão no Redis
      await redisClient.set(`user:${user.id}`, token, { EX: 3600 }).catch((error) => {
        console.error('Erro ao armazenar sessão no Redis:', error);
        return reply.status(500).send({ message: 'Erro interno do servidor' });
      });

      // Retornar token para o cliente
      return reply.status(200).send({ 
        message: 'Login bem-sucedido',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    
        const {email} = loginModel.parse(request.body);

        // Remove o usuário do Redis
        await redisClient.del(email).then(()=>{
          console.log('Sessão removida do Redis com sucesso');
          return reply.status(200).send({ message: 'Logout bem-sucedido' });

        }).catch((error) => {
          console.error('Erro ao remover sessão do Redis:', error);}
        )


     
    
  }

  static async register(req: FastifyRequest, res: FastifyReply) {
        const user = criarUsuarioModel.parse(req.body);
        const senhaCriptografada = await bcrypt.hash(user.senha, 12);
        await usuarioSchema.create({
            ...user,
            senha: senhaCriptografada
        }).then(()=>{
            console.log('Usuário criado com sucesso');
            res.status(201).send({ message: "Usuário criado com sucesso!" });

        }).catch((error) =>{
            console.error('Erro ao criar usuário:', error);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        })
    
       
    
  }
}