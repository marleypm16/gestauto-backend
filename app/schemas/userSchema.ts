import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nomeCompleto: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        required: true,
    },

    empresaId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true,
    }

},{timestamps:true});

export default mongoose.model("User", userSchema);