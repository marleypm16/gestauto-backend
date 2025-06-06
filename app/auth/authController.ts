import { FastifyReply, FastifyRequest } from "fastify";
import { loginModel } from "../models/loginModel";
import { redisClient } from "../plugin/redis";
import { findUserAuth } from "../utils/findUserAuth";
import { criarUsuarioModel } from "../models/criarUsuario";
import usuarioSchema from "../schemas/usuarioSchema";
import bcrypt from "bcryptjs";
import empresaSchema from "../schemas/empresaSchema";
import usuarioEmpresaSchema from "../schemas/usuarioEmpresaSchema";
import { registroModel } from "../models/registroModel";

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
          email: user.email,
        }
      });
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ message: 'Token não fornecido' });
      }    
      const token = authHeader.split(' ')[1];

        await redisClient.set(`blacklist:${token}`, token,{EX: 120 }).then(()=>{
          console.log('Sessão removida do Redis com sucesso');
          return reply.status(200).send({ message: 'Logout bem-sucedido' });

        }).catch((error) => {
          console.error('Erro ao remover sessão do Redis:', error);}
        )


     
    
  }

  static async register(req: FastifyRequest, res: FastifyReply) {
        const {user,company} = registroModel.parse(req.body);
        const senhaCriptografada = await bcrypt.hash(user.senha, 12);
        const existeusuarioComEmail = await usuarioSchema.findOne({email:user.email})
        if (existeusuarioComEmail) {
            return res.status(400).send({ message: 'E-mail já cadastrado' });
        }
        const existeEmpresaComCnpj = await usuarioSchema.findOne({ 'empresa.cnpj': company.cnpj });
        
        if (existeEmpresaComCnpj) {
            return res.status(400).send({ message: 'CNPJ já cadastrado' });
        }
       const empresaCriada = await empresaSchema.create({
            ...company
        })
        if (!empresaCriada) {
            return res.status(500).send({ message: 'Erro ao criar empresa' });
        }
        const usuarioCriado = await usuarioSchema.create({
            ...user,
            empresaId: empresaCriada._id,
            senha: senhaCriptografada
        })
        if (!usuarioCriado) {
            return res.status(500).send({ message: 'Erro ao criar usuário' });
        }
        await usuarioEmpresaSchema.create({
          usuarioId: usuarioCriado._id,
          empresaId: empresaCriada._id,
        })
    
       
    
  }
}