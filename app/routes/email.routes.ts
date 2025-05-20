import { FastifyInstance } from "fastify";
import { EmailController } from "../controller/emailController";

const emailRoutes = (app:FastifyInstance) => {
    app.post('/verify-email', EmailController.sendEmail)
}

export default emailRoutes;