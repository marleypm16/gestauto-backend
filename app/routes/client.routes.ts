import { FastifyInstance } from "fastify";
import { ClientController } from "../controller/clientController";

export const clientRoutes = (app: FastifyInstance) => {
    // Rotas com path parameter /empresas/:empresaId/clientes
    app.get('/empresas/:empresaId/clientes', {
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
                    email: { type: 'string' },
                    telefone: { type: 'string' },
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100 }
                }
            }
        }
    }, ClientController.getClients);

    app.get('/empresas/:empresaId/clientes/:id', {
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
    }, ClientController.getClientById);

    app.post('/empresas/:empresaId/clientes', {
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
                    email: { type: 'string', format: 'email' },
                    telefone: { type: 'string' },
                    endereco: { type: 'string' },
                    cpf: { type: 'string' },
                    data_nascimento: { type: 'string', format: 'date' }
                },
                required: ['nome']
            }
        }
    }, ClientController.createClient);

    app.put('/empresas/:empresaId/clientes/:id', {
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
                    email: { type: 'string', format: 'email' },
                    telefone: { type: 'string' },
                    endereco: { type: 'string' },
                    cpf: { type: 'string' },
                    data_nascimento: { type: 'string', format: 'date' }
                }
            }
        }
    }, ClientController.updateClient);
}