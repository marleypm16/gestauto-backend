import { redisClient } from "../plugin/redis";

const verifyToken = async (token: string): Promise<boolean> => {

    await redisClient.get(`blacklist:${token}`).then((token) => {
        if(token){
            console.log('Token encontrado na blacklist');
            return false;
        } else{
            console.log('Token não encontrado na blacklist');
            return true;
        }
    }).catch((error) => {
        console.error('Erro ao verificar token no Redis:', error);
        return false;
    })

    return false;
}

export default verifyToken;