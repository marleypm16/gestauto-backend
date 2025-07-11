import Fastify, { fastify } from 'fastify'
import jwtPlugin from './plugin/jwt'
import authRoutes from './routes/auth.routes'
import authenticatedRoutes from './routes/authenticated.routes'
import emailRoutes from './routes/email.routes'
import cors from './plugin/cors'
import otpRoute from './routes/otp.routes'
import cookiesPlugin from './plugin/cookies'
const app = Fastify()


app.get('/', async (request, reply) => {
  return { hello: 'world' }})
// Em algum lugar no seu setup de rotas

app.register(cors)
app.register(cookiesPlugin)

app.register(jwtPlugin)
app.register(emailRoutes)
app.register(otpRoute)
app.register(authRoutes)
app.register(authenticatedRoutes)




export default app


