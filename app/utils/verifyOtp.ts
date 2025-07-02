import { redisClient } from "../plugin/redis";

const verifyOtp = async (otp: string,email:string): Promise<boolean> => {
   
    const otpexists = await redisClient.get(`otp:${email}`);
    if(otp !== otpexists) {
        return false;
    }
    if (!otpexists) {
        throw new Error("OTP inválido ou expirado");
    }
    await redisClient.del(`otp:${email}`).catch((error) => {
        console.error('Erro ao remover OTP do Redis:', error);
    });
    return true;
    
}

export default verifyOtp;