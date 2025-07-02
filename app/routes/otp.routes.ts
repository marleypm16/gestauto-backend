import { FastifyInstance } from "fastify";
import { VerificarOtpController } from "../controller/verificarOtpController";
const verificarOtpController = new VerificarOtpController()
const otpRoute = async (app:FastifyInstance) => {
    app.post('/verificar-otp',(req,res) => verificarOtpController.verificarOtp(req,res))
}

export default otpRoute;