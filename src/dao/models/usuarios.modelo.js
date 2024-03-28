import mongoose from "mongoose";

const usuariosEsquema = new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        email: {
            type: String, 
            unique: true
        },
        age: Number, 
        password: String,
        car: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
        rol: String,
        documentos: [{
            name: String,
            reference: String
        }],
        last_connection: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", 
            createdAt: "FechaAlta"
        },
        strict: false
    }
);

export const usuariosModelo = mongoose.model("usuarios", usuariosEsquema);
