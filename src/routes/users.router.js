import { Router } from 'express';
import { usuariosModelo } from '../dao/models/usuarios.modelo.js';
export const router=Router()

router.get('/premium',(req,res)=>{
    let uid =  req.session.usuario.email
    
    res.status(200).render("rol",{uid})
})

router.post('/premium/:uid',async (req,res)=>{

   
    try {
        
        const { rol } = req.body;

        
        if (rol !== "usuario" && rol !== "premium") {
            return res.status(400).send("Rol inválido");
        }

        
        const updateUsuario = await usuariosModelo.findOne({
            email: req.params.uid 
        });

        
        if (!updateUsuario) {
            return res.status(404).send("Usuario no encontrado");
        }

        updateUsuario.rol = rol;
        await updateUsuario.save();

        
        res.status(200).send("Rol de usuario actualizado correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
})
