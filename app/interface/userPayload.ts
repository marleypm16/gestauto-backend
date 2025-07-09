// Em um arquivo como: src/interfaces/user.payload.ts

export interface UserPayload {
  id: string; // ou number, dependendo do seu banco de dados
  email: string;
  nome: string;
  // Adicione outras propriedades que você coloca no token
  iat: number; // Issued At (adicionado pelo jwt)
  exp: number; // Expiration Time (adicionado pelo jwt)
}