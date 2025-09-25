import { FastifyInstance } from 'fastify';
import { servicoController } from '../controller/servicoController';

export async function servicoRoutes(fastify: FastifyInstance) {
    // CRUD básico de serviços com path parameter
    fastify.get('/empresas/:empresaId/servicos', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            },
            querystring: {
                type: 'object',
                properties: {
                    nome: { type: 'string' },
                    passoAPasso: { type: 'string' },
                    ativo: { type: 'boolean' },
                    precoMin: { type: 'number', minimum: 0 },
                    precoMax: { type: 'number', minimum: 0 },
                    ordenarPor: { type: 'string', enum: ['nome', 'preco', 'maisUtilizados', 'maisLucrativos', 'recentes'] },
                    ordem: { type: 'string', enum: ['asc', 'desc'] },
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100 }
                }
            }
        }
    }, servicoController.buscarTodosServicos.bind(servicoController));

    fastify.get('/empresas/:empresaId/servicos/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' },
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId', 'id']
            }
        }
    }, servicoController.buscarServicoPorId.bind(servicoController));

    fastify.post('/empresas/:empresaId/servicos', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            },
            body: {
                type: 'object',
                properties: {
                    nome: { type: 'string', minLength: 2, maxLength: 100 },
                    descricao: { type: 'string', maxLength: 500 },
                    preco: { type: 'number', minimum: 0.01 },
                    duracao: { type: 'integer', minimum: 1 },
                    passoAPasso: { type: 'string', maxLength: 2000 },
                    ativo: { type: 'boolean' }
                },
                required: ['nome', 'preco', 'duracao']
            }
        }
    }, servicoController.criarServico.bind(servicoController));

    fastify.put('/empresas/:empresaId/servicos/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' },
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId', 'id']
            },
            body: {
                type: 'object',
                properties: {
                    nome: { type: 'string', minLength: 2, maxLength: 100 },
                    descricao: { type: 'string', maxLength: 500 },
                    preco: { type: 'number', minimum: 0.01 },
                    duracao: { type: 'integer', minimum: 1 },
                    passoAPasso: { type: 'string', maxLength: 2000 },
                    ativo: { type: 'boolean' }
                }
            }
        }
    }, servicoController.atualizarServico.bind(servicoController));

    fastify.delete('/empresas/:empresaId/servicos/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' },
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId', 'id']
            }
        }
    }, servicoController.deletarServico.bind(servicoController));

    // Rotas específicas de serviços com path parameter
    fastify.get('/empresas/:empresaId/servicos/ativos/lista', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            }
        }
    }, servicoController.buscarServicosAtivos.bind(servicoController));

    fastify.get('/empresas/:empresaId/servicos/passo-a-passo/:busca', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' },
                    busca: { type: 'string', minLength: 1 }
                },
                required: ['empresaId', 'busca']
            }
        }
    }, servicoController.buscarServicosPorPassoAPasso.bind(servicoController));
    
    // Rotas de ordenação com path parameter
    fastify.get('/empresas/:empresaId/servicos/mais-utilizados', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            },
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100 },
                    ordem: { type: 'string', enum: ['asc', 'desc'] }
                }
            }
        }
    }, servicoController.buscarServicosMaisUtilizados.bind(servicoController));

    fastify.get('/empresas/:empresaId/servicos/mais-lucrativos', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            },
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100 },
                    ordem: { type: 'string', enum: ['asc', 'desc'] }
                }
            }
        }
    }, servicoController.buscarServicosMaisLucrativos.bind(servicoController));

    fastify.get('/empresas/:empresaId/servicos/ranking', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            },
            querystring: {
                type: 'object',
                properties: {
                    limite: { type: 'integer', minimum: 1, maximum: 50 },
                    tipo: { type: 'string', enum: ['utilizados', 'lucrativos'] }
                }
            }
        }
    }, servicoController.obterRankingServicos.bind(servicoController));
    
    // Ações específicas com path parameter
    fastify.patch('/empresas/:empresaId/servicos/:id/status', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' },
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId', 'id']
            },
            body: {
                type: 'object',
                properties: {
                    ativo: { type: 'boolean' }
                },
                required: ['ativo']
            }
        }
    }, servicoController.ativarDesativarServico.bind(servicoController));

    fastify.post('/empresas/:empresaId/servicos/:id/duplicar', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' },
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId', 'id']
            },
            body: {
                type: 'object',
                properties: {
                    novoNome: { type: 'string', minLength: 2, maxLength: 100 }
                },
                required: ['novoNome']
            }
        }
    }, servicoController.duplicarServico.bind(servicoController));
    
    // Relatórios e estatísticas com path parameter
    fastify.get('/empresas/:empresaId/servicos/relatorios/estatisticas', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    empresaId: { type: 'string', format: 'uuid' }
                },
                required: ['empresaId']
            }
        }
    }, servicoController.obterEstatisticasServicos.bind(servicoController));
}
