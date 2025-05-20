import { FastifyReply, FastifyRequest } from "fastify";
import { EmailService } from "../services/emailService";
import generateOtp from "../utils/generateOtp";
import { verifyEmailModel } from "../models/verifyEmailModel";

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
}