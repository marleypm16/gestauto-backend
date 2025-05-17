// src/index.js
import Fastify from 'fastify'
import userRoutes from './routes/user.routes'
import empresaRoutes from './routes/empresa.routes'
import jwtPlugin from './plugin/jwt'
import authRoutes from './routes/auth.routes'
const app = Fastify()


app.get('/', async (request, reply) => {
  return { hello: 'world' }})

app.register(jwtPlugin)
app.register(authRoutes)
app.register(userRoutes)
app.register(empresaRoutes)




export default app


