// src/index.js
import Fastify from 'fastify'
import connectDB from './database/db';
const app = Fastify()



  app.get('/', async (req, reply) => {
    return { status: 'OK', message: 'MongoDB está conectado!' }
  })

  app.listen({ port: 8080  }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`🚀 Servidor rodando em ${address}`)
  })

