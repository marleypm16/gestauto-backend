// src/index.js
import Fastify from 'fastify'
import jwtPlugin from './plugin/jwt'
import authRoutes from './routes/auth.routes'
import authenticatedRoutes from './routes/authenticated.routes'
const app = Fastify()


app.get('/', async (request, reply) => {
  return { hello: 'world' }})

app.register(jwtPlugin)
app.register(authRoutes)
app.register(authenticatedRoutes)




export default app


