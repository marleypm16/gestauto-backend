import { FastifyInstance } from "fastify";
import authMiddleware from "../middleware/middleware";
import userRoutes from "./user.routes";
import empresaRoutes from "./empresa.routes";
import { clientRoutes } from "./client.routes";


const authenticatedRoutes = (app:FastifyInstance) => {
    app.addHook("onRequest", authMiddleware)
    app.register(userRoutes)
    app.register(empresaRoutes)
    app.register(clientRoutes)
}

export default authenticatedRoutes;