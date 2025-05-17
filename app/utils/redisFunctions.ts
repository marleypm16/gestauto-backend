import { redisClient } from "../plugin/redis"

export const storeToken = async (token:string) =>{
    await redisClient.set(`user:${token}`, token, { EX: 120 }).catch((error) => {
        console.error('Erro ao armazenar sessão no Redis:', error);
        throw new Error('Erro ao armazenar sessão no Redis');
    }) 
}

export const storeTokenBlackList = async (token:string) =>{
    await redisClient.set(`blacklist:${token}`, token, { EX: 120 }).then(()=>{
        console.log('Sessão armazenada na blacklist com sucesso');
        return;
    }).catch((error) => {
        console.error('Erro ao armazenar sessão a blacklist:', error);
        throw new Error('Erro ao armazenar sessão no Redis');
    })
}






