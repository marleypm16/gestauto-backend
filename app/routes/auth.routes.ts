import { FastifyInstance } from "fastify";
import { AuthController } from "../auth/authController";

const authRoutes = (app: FastifyInstance) => {
    app.post("/auth/login",AuthController.login);
    app.post("/auth/logout",AuthController.logout);
    app.post("/auth/register", AuthController.register);
}

export default authRoutes;