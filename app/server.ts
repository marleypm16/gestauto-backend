  import app from "."
import connectDB from "./database/db"
const start = async () => {
    await connectDB().then(() => {
        console.log('MongoDB conectado')
    }).catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error)
        process.exit(1)
    })
    app.listen({ port: 8080  }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`🚀 Servidor rodando em ${address}`)
  })
}

start()
 