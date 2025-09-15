import { FastifyInstance } from 'fastify';
import { servicoController } from '../controller/servicoController';

export async function servicoRoutes(fastify: FastifyInstance) {
    // CRUD básico de serviços
    fastify.get('/servicos', servicoController.buscarTodosServicos.bind(servicoController));
    fastify.get('/servicos/:id', servicoController.buscarServicoPorId.bind(servicoController));
    fastify.post('/servicos', servicoController.criarServico.bind(servicoController));
    fastify.put('/servicos/:id', servicoController.atualizarServico.bind(servicoController));
    fastify.delete('/servicos/:id', servicoController.deletarServico.bind(servicoController));

    // Rotas específicas de serviços
    fastify.get('/servicos/ativos/lista', servicoController.buscarServicosAtivos.bind(servicoController));
    fastify.get('/servicos/passo-a-passo/:busca', servicoController.buscarServicosPorPassoAPasso.bind(servicoController));
    fastify.get('/servicos/populares/ranking', servicoController.buscarServicosPopulares.bind(servicoController));
    
    // Novas rotas de ordenação
    fastify.get('/servicos/mais-utilizados', servicoController.buscarServicosMaisUtilizados.bind(servicoController));
    fastify.get('/servicos/mais-lucrativos', servicoController.buscarServicosMaisLucrativos.bind(servicoController));
    fastify.get('/servicos/ranking', servicoController.obterRankingServicos.bind(servicoController));
    
    // Ações específicas
    fastify.patch('/servicos/:id/status', servicoController.ativarDesativarServico.bind(servicoController));
    fastify.post('/servicos/:id/duplicar', servicoController.duplicarServico.bind(servicoController));
    
    // Relatórios e estatísticas
    fastify.get('/servicos/relatorios/estatisticas', servicoController.obterEstatisticasServicos.bind(servicoController));
}
