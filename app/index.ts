// src/index.js
import Fastify from 'fastify'
import userRoutes from './routes/user.routes'
const app = Fastify()


app.get('/', async (request, reply) => {
  return { hello: 'world' }})

app.register(userRoutes)



export default app


