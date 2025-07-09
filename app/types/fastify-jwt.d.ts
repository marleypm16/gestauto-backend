
import '@fastify/jwt';
import { UserPayload } from '../interface/userPayload'; // <-- Ajuste o caminho para sua interface

declare module '@fastify/jwt' {
  // Esta interface será mesclada com a interface original do @fastify/jwt
  interface FastifyJWT {
    // Define o tipo para o payload que você passa para jwt.sign()
    payload: Partial<UserPayload>; 
    // Define o tipo para a propriedade 'user' que é adicionada ao objeto 'request'
    user: UserPayload;    
  }
}