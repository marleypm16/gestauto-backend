import {createClient} from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: '*******',
    socket: {
        host: 'redis-14390.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
        port: 14390
    }
})

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

export async function connectRedis() {
    await redisClient.connect();
    console.log('Redis Client Connected');
}


