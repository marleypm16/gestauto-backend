import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://gestauto:gestautoadmin123@gestauto.wypz9yd.mongodb.net/?retryWrites=true&w=majority&appName=GestAuto').then((
        () => {
            console.log('MongoDB connected');
        }
    )).catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    });
  
}

export default connectDB;
