import { FastifyInstance } from "fastify";
import app from "..";
import { UsuarioController } from "../controller/usuarioController";

const userRoutes = async (app:FastifyInstance) =>{
    app.get("/usuarios", UsuarioController.getUsuarios);
    app.post("/usuarios", UsuarioController.createUsuario);
}

export default userRoutes;