import { FastifyInstance } from "fastify";
import { CarroController } from "../controller/carroController";

export const carRoutes = (app: FastifyInstance) => {
  // Criar carro para cliente específico com path parameter
  app.post('/empresas/:empresaId/clientes/:clientId/carros', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          clientId: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'clientId']
      },
      body: {
        type: 'object',
        properties: {
          marca: { type: 'string', minLength: 2, maxLength: 50 },
          modelo: { type: 'string', minLength: 2, maxLength: 50 },
          ano: { type: 'integer', minimum: 1900, maximum: 2030 },
          placa: { type: 'string', minLength: 7, maxLength: 8 },
          cor: { type: 'string', minLength: 2, maxLength: 30 },
        },
        required: ['marca', 'modelo', 'ano', 'placa']
      }
    }
  }, CarroController.createCarro);


  // Atualizar carro
  app.put('/empresas/:empresaId/clientes/:clientId/carros/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          clientId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'clientId', 'id']
      },
      body: {
        type: 'object',
        properties: {
          marca: { type: 'string', minLength: 2, maxLength: 50 },
          modelo: { type: 'string', minLength: 2, maxLength: 50 },
          ano: { type: 'integer', minimum: 1900, maximum: 2030 },
          placa: { type: 'string', minLength: 7, maxLength: 8 },
          cor: { type: 'string', minLength: 2, maxLength: 30 },
        }
      }
    }
  }, CarroController.updateCarro);

  // Excluir carro
  app.delete('/empresas/:empresaId/clientes/:clientId/carros/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string', format: 'uuid' },
          clientId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' }
        },
        required: ['empresaId', 'clientId', 'id']
      }
    }
  }, CarroController.deleteCarro);

 

}