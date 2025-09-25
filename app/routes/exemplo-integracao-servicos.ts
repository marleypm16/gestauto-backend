// Exemplo de como integrar as rotas de serviço no seu servidor principal
// Adicione este código no seu arquivo server.ts ou onde você registra as rotas

import { servicoRoutes } from './routes/servico.routes';

// No seu método de inicialização do Fastify:
export async function setupRoutes(fastify: FastifyInstance) {
    // Registrar as rotas de serviços
    await fastify.register(servicoRoutes, { prefix: '/api/v1' });
    
    // Outras rotas...
    // await fastify.register(carroRoutes, { prefix: '/api/v1' });
    // await fastify.register(clienteRoutes, { prefix: '/api/v1' });
}

/* 
ROTAS DISPONÍVEIS APÓS IMPLEMENTAÇÃO:

GET    /api/v1/servicos                        - Listar todos os serviços (com paginação e filtros)
GET    /api/v1/servicos/:id                    - Buscar serviço por ID
POST   /api/v1/servicos                        - Criar novo serviço
PUT    /api/v1/servicos/:id                    - Atualizar serviço
DELETE /api/v1/servicos/:id                    - Deletar serviço

GET    /api/v1/servicos/ativos/lista           - Listar apenas serviços ativos
GET    /api/v1/servicos/categoria/:categoria   - Buscar serviços por categoria
GET    /api/v1/servicos/populares/ranking      - Serviços mais populares

PATCH  /api/v1/servicos/:id/status             - Ativar/desativar serviço
POST   /api/v1/servicos/:id/duplicar           - Duplicar serviço

GET    /api/v1/servicos/relatorios/estatisticas - Estatísticas dos serviços

EXEMPLOS DE USO:

1. Criar serviço:
POST /api/v1/servicos
{
  "nome": "Troca de Óleo",
  "descricao": "Troca de óleo do motor",
  "preco": 50.00,
  "duracao": 30,
  "categoria": "Manutenção",
  "tempoPosvenda": 30
}

2. Buscar serviços com filtros:
GET /api/v1/servicos?nome=oleo&categoria=manutencao&ativo=true&page=1&limit=10

3. Ativar/desativar serviço:
PATCH /api/v1/servicos/:id/status
{
  "ativo": false
}

4. Duplicar serviço:
POST /api/v1/servicos/:id/duplicar
{
  "novoNome": "Troca de Óleo Premium"
}
*/
