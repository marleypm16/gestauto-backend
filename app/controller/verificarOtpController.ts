import { FastifyReply, FastifyRequest } from "fastify";
import verifyOtp from "../utils/verifyOtp";
import { verificarOtpModel } from "../models/verificarOtpModel";

export class VerificarOtpController {
    async verificarOtp(req: FastifyRequest, res: FastifyReply) {
        const { otp,email } = verificarOtpModel.parse(req.body);

        const otpexists = await verifyOtp(otp,email);
        if (otpexists) {
           return res.status(200).send({ message: "OTP válido" });
        }
       
        return res.status(400).send({ message: "OTP inválido ou expirado" });
    }
}