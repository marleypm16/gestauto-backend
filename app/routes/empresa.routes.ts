import { FastifyInstance } from "fastify";
import { EmpresaController } from "../controller/empresaController";

const empresaRoutes = async (app: FastifyInstance) => {
    app.get("/empresas",EmpresaController.getEmpresas)
    app.get("/empresas/:id",EmpresaController.getEmpresaUser)
    app.post("/empresas",EmpresaController.createEmpresa)
}

export default empresaRoutes;
