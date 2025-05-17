
import {createClient} from 'redis';


export const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.PORT_REDIS) || 6379
    }
})

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});


export async function connectRedis() {
    await redisClient.connect().then(() => {
        console.log('Redis conectado');}).catch((err) => {
                    console.log('Erro ao conectar no Redis', err);

            return
        })
}


