import { FastifyInstance } from "fastify";
import authMiddleware from "../middleware/middleware";
import userRoutes from "./user.routes";
import empresaRoutes from "./empresa.routes";


const authenticatedRoutes = (app:FastifyInstance) => {
    app.addHook("onRequest", authMiddleware)
    app.register(userRoutes)
    app.register(empresaRoutes)
}

export default authenticatedRoutes;