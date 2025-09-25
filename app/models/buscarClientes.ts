import { z } from "zod";
export const getClientesQuerySchema = z.object({
  // Parâmetro da empresa é obrigatório para saber de qual empresa listar os clientes


  // Parâmetros de Filtro (opcionais)
  busca: z.string().optional(),
  nome: z.string().optional(),
  email: z.string().optional(),
  placa: z.string().optional(),
  carro: z.string().optional(), // Supondo que 'carro' é o modelo
  ativo: z.enum(['true', 'false']).transform(val => val === 'true').optional(), // Converte a string 'true'/'false' para booleano

  // Parâmetros de Ordenação (com valores padrão)
  sortBy: z.string().default('nome'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),

  // Parâmetros de Paginação (com valores padrão e coerção para número)
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});


