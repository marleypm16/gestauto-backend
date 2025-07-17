import { FastifyInstance } from "fastify";
import authMiddleware from "../middleware/middleware";
import userRoutes from "./user.routes";
import empresaRoutes from "./empresa.routes";
import { clientRoutes } from "./client.routes";
import { carRoutes } from "./car.route";


const authenticatedRoutes = (app:FastifyInstance) => {
    app.addHook("onRequest", authMiddleware)
    app.register(userRoutes)
    app.register(empresaRoutes)
    app.register(clientRoutes)
    app.register(carRoutes)
}

export default authenticatedRoutes;