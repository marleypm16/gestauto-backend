import { FastifyInstance } from "fastify";
import authMiddleware from "../middleware/middleware";
import userRoutes from "./user.routes";
import empresaRoutes from "./empresa.routes";
import { clientRoutes } from "./client.routes";
import { carRoutes } from "./car.route";
import { servicoRoutes } from "./servico.routes";
import produtoRoutes from "./produto.routes";
import estoqueRoutes from "./estoque.routes";


const authenticatedRoutes = (app:FastifyInstance) => {
    app.addHook("onRequest", authMiddleware)
    app.register(userRoutes)
    app.register(empresaRoutes)
    app.register(clientRoutes)
    app.register(servicoRoutes)
    app.register(carRoutes)
    app.register(produtoRoutes)
    app.register(estoqueRoutes)
}

export default authenticatedRoutes;