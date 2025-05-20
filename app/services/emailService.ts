import { redisClient } from "../plugin/redis";
import sendEmailSes from "../plugin/ses";

export class EmailService{
   static async  sendEmail(to: string,otp:number): Promise<void> {       
        await redisClient.set(`otp:${to}`, otp, { EX: 300 }).catch((error) => {
            console.error('Erro ao armazenar OTP no Redis:', error);
            throw new Error('Erro ao armazenar OTP no Redis');
        })

        await sendEmailSes(to,otp)
        
    }
}