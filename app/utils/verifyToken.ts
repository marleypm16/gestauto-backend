import { redisClient } from "../plugin/redis";

const verifyToken = async (token: string,userId:string): Promise<boolean> => {
    const storedToken = await redisClient.get(`user:${userId}`)
    console.log('Token armazenado:', storedToken);
    console.log('Token recebido:', token);
    console.log(token === storedToken);
    
    if(storedToken === token){
        console.log('Token válido');
        return true;
    } else{
            console.log('Token inválido ');
            return false;
        }

}

export default verifyToken;