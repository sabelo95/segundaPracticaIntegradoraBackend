import { Router } from 'express';
import { usuariosModelo } from '../dao/models/usuarios.modelo.js';
import multer from 'multer';
export const router=Router()



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        let folder;
       
        if (file.originalname.includes('perfil')) {
            folder = 'profiles';
        } else if (file.originalname.includes('producto')) {
            folder = 'products';
        } else {
            folder = 'documents';
        } 
        cb(null, `./src/uploads/${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage })

// Ruta para subir documentos a un usuario específico por su ID (uid)
router.post('/:uid/documents', upload.array('perfil'), async (req, res) => {

    const userId = req.params.uid;
    const documentos = req.files;

    let usuario = await usuariosModelo.findOne({_id: userId});
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.documentos = documentos.map(doc => ({
        name: doc.originalname,
        
    }));
    await usuario.save();
    res.status(200).json({ message: 'Documentos subidos exitosamente' });
});


router.get('/documents',(req,res)=>{
    
    let id=req.user._id
    res.status(200).render("documents",{id})
})



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

        console.log(updateUsuario.documentos)

        
        if (!updateUsuario) {
            return res.status(404).send("Usuario no encontrado");
        }

             // Verificar si los documentos requeridos están presentes
             const documentosRequeridos = ['identificacion', 'domicilio', 'estado'];

            const documentosUsuario = updateUsuario.documentos.map(doc => doc.name.toLowerCase()); // Convertir a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas

            const documentosFaltantes = documentosRequeridos.filter(reqDoc => !documentosUsuario.some(userDoc => userDoc.includes(reqDoc)));


             if (documentosFaltantes.length > 0) {
                return res.status(400).send(`Faltan los siguientes documentos: ${documentosFaltantes.join(', ')}`);
            }



        updateUsuario.rol = rol;
        await updateUsuario.save();

        
        res.status(200).send("Rol de usuario actualizado correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
})

