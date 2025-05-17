import app from "."
import connectDB from "./database/db"
import { connectRedis } from "./plugin/redis"
import dotenv from 'dotenv'
dotenv.config()
const start = async () => {
    await connectDB()
    await connectRedis()
    app.listen({ port: 8080  }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log( `Servidor rodando em ${address}`)
  })
}

start()
 