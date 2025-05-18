import { FastifyReply, FastifyRequest } from "fastify";
import { loginModel } from "../models/loginModel";
import { redisClient } from "../plugin/redis";
import { findUserAuth } from "../utils/findUserAuth";
import { criarUsuarioModel } from "../models/criarUsuario";
import usuarioSchema from "../schemas/usuarioSchema";
import bcrypt from "bcryptjs";
import { storeToken, storeTokenBlackList } from "../utils/redisFunctions";

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
        nome: user.nomeCompleto,
      });

      // Armazenar sessão no Redis
      await storeToken(token).catch(() => {
        return reply.status(500).send({ message: 'Erro Interno do servidor' });
      })
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
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ message: 'Token não fornecido' });
      }    
      const token = authHeader.split(' ')[1];

      await storeTokenBlackList(token)

      return reply.status(200).send({ message: 'Logout bem-sucedido' });


     
    
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