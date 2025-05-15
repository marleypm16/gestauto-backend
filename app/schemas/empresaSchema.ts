import mongoose from "mongoose";

const empresaSchema = new mongoose.Schema({
    nomeEmpresa: {
        type: String,
        required: true,
    },
    cnpj:{
        type: String,
        required: true,
        unique: true,
    },
    emailEmpresa:{
        type: String,
        unique: true,       
    },
    telefoneEmpresa:{
        type: String,
    },
    endereco:{
        cep:String,
        rua:String,
        numero:String,
        bairro:String,
        cidade:String,
        uf:String,
        complemento:String,
    }
},{timestamps:true});

export default mongoose.model("Empresa", empresaSchema);