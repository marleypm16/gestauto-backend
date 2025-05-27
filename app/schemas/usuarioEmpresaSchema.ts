import mongoose from "mongoose";

const usuarioEmpresaSchema = new mongoose.Schema({
    usuarioId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    empresaId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true,
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "admin",
    },
    salary: Number,
    position: String,
    permissions: [String],
    hireDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
    
},{timestamps:true});
usuarioEmpresaSchema.index({ userId: 1, companyId: 1 }, { unique: true });

export default mongoose.model("UsuarioEmpresa", usuarioEmpresaSchema);
