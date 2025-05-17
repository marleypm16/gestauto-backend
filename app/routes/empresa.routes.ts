import { FastifyInstance } from "fastify";
import { EmpresaController } from "../controller/empresaController";

const empresaRoutes = async (app: FastifyInstance) => {
    app.get("/empresas",EmpresaController.getEmpresas)
    app.post("/empresas",EmpresaController.createEmpresa)
}

export default empresaRoutes;
