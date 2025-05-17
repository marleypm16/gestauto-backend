import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect(
        process.env.DB_URL || 'mongodb://localhost:27017/mydatabase',
    ).then((
        () => {
            console.log('Banco de dados conectado com sucesso');
        }
    )).catch((error) => {
        console.error('Erro ao conectar com banco de dados:', error);
        process.exit(1); 
    });
  
}

export default connectDB;
