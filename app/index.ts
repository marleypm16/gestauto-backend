// src/index.js
import Fastify from 'fastify'
const app = Fastify()



  app.get('/', async (req, reply) => {
    return { status: 'OK', message: 'MongoDB está conectado!' }
  })



export default app


