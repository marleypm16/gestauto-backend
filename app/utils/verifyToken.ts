import { redisClient } from "../plugin/redis";

const verifyToken = async (token: string): Promise<boolean> => {

    const tokenBlacklist = await redisClient.get(`blacklist:${token}`)
    if(tokenBlacklist){
        console.log('Token encontrado na blacklist');
        return false;
    } else{
            console.log('Token não encontrado na blacklist');
            return true;
        }

}

export default verifyToken;