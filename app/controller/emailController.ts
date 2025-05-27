import { FastifyReply, FastifyRequest } from "fastify";
import { EmailService } from "../services/emailService";
import generateOtp from "../utils/generateOtp";
import { verifyEmailModel } from "../models/verifyEmailModel";
import { verificarEmailModel } from "../models/verificarEmailModel";
import { redisClient } from "../plugin/redis";

export class EmailController {
    static async sendEmail(req: FastifyRequest, res: FastifyReply): Promise<void> {
       const {to} = verifyEmailModel.parse(req.body);

        try {
            const otp = generateOtp();
            await EmailService.sendEmail(to,otp);
            res.status(200).send({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send({ message: 'Error sending email' });
        }
    }

    static async verifyEmail(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { email, otp } = verificarEmailModel.parse(req.body);

        try {
            const user = await EmailService.verifyEmail(email, otp);
            if (user) {
                const token = req.server.jwt.sign({
                    id: user.id,
                    email: user.email,
                    nome: user.nome
                });
                await redisClient.set(`user:${user.id}`, token, { EX: 3600 }).catch((error) => {
                        console.error('Erro ao armazenar sessão no Redis:', error);
                        return res.status(500).send({ message: 'Erro interno do servidor' });
                      });
                
                      // Retornar token para o cliente
                      return res.status(200).send({ 
                        message: 'Email verified successfully',
                        token,
                        user: {
                          id: user.id,
                          email: user.email,
                        }
                      });

            } else {
                res.status(400).send({ message: 'Invalid OTP' });
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            res.status(500).send({ message: 'Error verifying email' });
        }
    }
}