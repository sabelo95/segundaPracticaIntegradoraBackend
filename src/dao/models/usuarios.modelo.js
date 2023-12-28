import mongoose from "mongoose";

const usuariosEsquema=new mongoose.Schema(
    {
        nombre: String,
        email: {
            type: String, unique: true
        },
        password: String,
        rol: String
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        },
        strict:false
    }
)

export const usuariosModelo=mongoose.model("usuarios", usuariosEsquema)