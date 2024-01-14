import { Router } from 'express';
import { usuariosModelo } from '../dao/models/usuarios.modelo.js';
import { creaHash, validaPassword } from '../utils.js';
import passport from 'passport';
export const router=Router()

router.get('/errorLogin',(req,res)=>{
    return res.redirect('/login?error=Error en el proceso de login... :(')
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), async(req, res)=>{

    req.session.usuario={
        nombre:req.user.nombre, email:req.user.email , rol: req.user.rol, car: req.user.car
    }

    res.redirect('/api/products')

})

router.post('/registro', passport.authenticate('registro', {failureRedirect:'/api/sessions/errorRegistro'}), async(req,res)=>{
    
    let {email}=req.body
    

    res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)

})

router.get('/errorRegistro',(req,res)=>{
    return res.redirect('/registro?error=Error en el proceso de registro')
})

router.get('/github', passport.authenticate('github',{}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    
    
    req.session.usuario=req.user
    res.redirect('/api/products')
});

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error: "Error al autenticar con Github"
    });
});

router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/login?error=fallo en el logout')
        }
    })

    res.redirect('/login')

});

router.get('/current',(req,res)=>{
    
    res.status(200).json(req.session.usuario);
});