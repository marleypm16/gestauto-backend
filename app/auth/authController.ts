import { FastifyReply, FastifyRequest } from "fastify";
import { loginModel } from "../models/loginModel";
import { redisClient } from "../plugin/redis";
import { findUserAuth } from "../utils/findUserAuth";
import bcrypt from "bcryptjs";

import { registroModel } from "../models/registroModel";
import prisma from "../plugin/postgres";

export class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
      const {email,senha} = loginModel.parse(request.body);
      
      const user = await findUserAuth(email, senha);
      
      if (!user) {
        return reply.status(401).send({ message: 'E-mail ou senha inválidos' });
      }

      // Gerar token JWT com mais dados do usuário
      const token = request.server.jwt.sign({ 
        id: user.id, 
        email: user.email,
        nome: user.nome,
      });


      await redisClient.set(`user:${user.id}`, token, { EX: 3600 }).catch((error) => {
        console.error('Erro ao armazenar sessão no Redis:', error);
        return reply.status(500).send({ message: 'Erro interno do servidor' });
      });

      reply.setCookie('accessToken', token, {
        path: '/',
        httpOnly: true,
        secure: false, // Use secure cookies em produção
        sameSite: "lax", // Protege contra CSRF
        maxAge: 3600, // 1 hora
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
      const token = request.cookies.accessToken || request.headers.authorization?.split(' ')[1];
      if (!token) {
        return reply.status(401).send({ message: 'Nenhum token fornecido' });
      }
    

        await redisClient.set(`blacklist:${token}`, token,{EX: 120 }).then(()=>{
          console.log('Sessão removida do Redis com sucesso');
          return reply.status(200).send({ message: 'Logout bem-sucedido' });

        }).catch((error) => {
          console.error('Erro ao remover sessão do Redis:', error);}
        )

        reply.clearCookie('acessToken',{path:'/'});


     
    
  }

  static async register(req: FastifyRequest, res: FastifyReply) {
        const {user,company} = registroModel.parse(req.body);
        const senhaCriptografada = await bcrypt.hash(user.senha, 12);
        const existeusuarioComEmail = await prisma.user.findFirst({
          where: {
            email: user.email
          }
        })
        if (existeusuarioComEmail) {
            return res.status(400).send({ message: 'E-mail já cadastrado' });
        }
        const existeEmpresaComCnpj = await prisma.empresa.findFirst({
          where:{
            cnpj: company.cnpj
          }
        });
        
        if (existeEmpresaComCnpj) {
            return res.status(400).send({ message: 'CNPJ já cadastrado' });
        }
       const empresaCriada = await prisma.empresa.create({
            data:company
        })
        if (!empresaCriada) {
            return res.status(500).send({ message: 'Erro ao criar empresa' });
        }
        const usuarioCriado = await prisma.user.create({
          data:{
            ...user,
           senha : senhaCriptografada
          }
         
        })
        if (!usuarioCriado) {
            return res.status(500).send({ message: 'Erro ao criar usuário' });
        }
        await prisma.usuarioEmpresa.create({
          data:{
            userId: usuarioCriado.id,
            empresaId: empresaCriada.id,
            funcao: "Proprietário",
            permisso: "admin",
            
          }
       
        })
    
       
    
  }
}