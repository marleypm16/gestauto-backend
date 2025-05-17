import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginModel } from "../models/loginModel";
import { redisClient } from "../plugin/redis";
import { findUserAuth } from "../utils/findUserAuth";
import { criarUsuarioModel } from "../models/criarUsuario";
import usuarioSchema from "../schemas/usuarioSchema";
import { unknown } from "zod";
import bcrypt from "bcryptjs";

export class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginData = loginModel.parse(request.body);
      const { email, senha } = loginData;

      // Verificar usuário e credenciais
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
      await redisClient.set(`user:${user.id}`, token, { EX: 3600 });

      // Retornar token para o cliente
      return reply.status(200).send({ 
        message: 'Login bem-sucedido',
        token,
        user: {
          id: user.id,
          email: user.email
          // outros dados não sensíveis
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return reply.status(500).send({ message: 'Erro interno no servidor' });
    }
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
        const loginData = loginModel.parse(request.body);
        const { email } = loginData;

        // Remove o usuário do Redis
        await redisClient.del(email);

        return reply.status(200).send({ message: 'Logout bem-sucedido' });

    } catch (error) {
      console.error('Erro no logout:', error);
      return reply.status(401).send({ message: 'Não autorizado ou token inválido' });
    }
  }

  static async register(req: FastifyRequest, res: FastifyReply) {
     const user = criarUsuarioModel.parse(req.body);
    try{
        const senhaCriptografada = await bcrypt.hash(user.senha, 10);
        await usuarioSchema.create({
            ...user,
            senha: senhaCriptografada
        })
       res.status(201).send({ message: "Usuário criado com sucesso!" });
    }
    catch (error: Error | unknown) {
        if(error instanceof Error){
            return res.status(500).send(error.message);
        }
        if(unknown instanceof unknown){
            return res.status(500).send("Erro desconhecido");
        }
    }
  }
}