import { redisClient } from "../plugin/redis";
import sendEmailSes from "../plugin/ses";
import usuarioSchema from "../schemas/usuarioSchema";
import verifyOtp from "../utils/verifyOtp";

export class EmailService{
   static async  sendEmail(to: string,otp:number): Promise<void> {       
        await redisClient.set(`otp:${to}`, otp, { EX: 3000 }).catch((error) => {
            console.error('Erro ao armazenar OTP no Redis:', error);
            throw new Error('Erro ao armazenar OTP no Redis');
        })

        await sendEmailSes(to,otp)
        
    }
    static async verifyEmail(email: string, otp: number) {
        const otpexists = await verifyOtp(otp.toString(),email);
        if (otpexists) {
            const usuario = await usuarioSchema.findOne({
                email
            })
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            await redisClient.del(`otp:${email}`);
            await usuario.updateOne({
                email,
                $set:{
                    emailVerificado: true
                }
            })
            return {
                id: usuario._id,
                nome: usuario.nomeCompleto,
                email: usuario.email
            };
        }
        return null;
    }

}