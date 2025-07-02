import { FastifyInstance } from "fastify";
import { EmailController } from "../controller/emailController";
import { NovaSenhaController } from "../controller/novaSenhaController";
const novaSenhaController = new NovaSenhaController()
const emailRoutes = async (app:FastifyInstance) => {
    app.post('/send-email', EmailController.sendEmail)
    app.post('/email-verify', EmailController.verifyEmail)
    app.post('/nova-senha',(req,res) => novaSenhaController.criarNovaSenha(req,res))
}

export default emailRoutes;