import { Router } from 'express';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import { usuariosModelo } from '../dao/models/usuarios.modelo.js';
export const router=Router()

const transport=nodemailer.createTransport(
      {
          service: 'gmail',
          port: 587, 
          auth: {
              user: "santiagoberriolopez@gmail.com",
              pass: "sqznhvyyrhvcoctd"
          }
      }
  )

 

  router.post("/", async (req, res) => {
      try {
          const { email } = req.body;
  
          let usuario = await usuariosModelo.findOne({ email }).lean();
          if (!usuario) {
              throw new Error("Usuario no encontrado");
          }

      delete usuario.password
      let token=jwt.sign({...usuario}, "CoderCoder123", {expiresIn:"1h"})
  
          const enviar = () => {
              return transport.sendMail({
                  from: "Santiago Berrio santiagoberriolopez@gmail.com",
                  to: req.body.email,
                  subject: "Recuperar contraseña",
                  html:`Hola. Ha solicitado reiniciar... 
                  Haga click en el siguiente link: <a href="http://localhost:8080/api/recovery/recupero02?token=${token}">Resetear Contraseña</a>
                  Si no genero un reseteto... `,
              });
          };
  
          enviar()
              .then(result => {
                  
                  res.status(200).render("login", {
                        mensaje: 'correo enviado satisfactoriamente',
                        
                      })
              })
              .catch(err => {
                  console.log(err.message);
                  throw new Error("Error al enviar el correo");
              });
      } catch (error) {
          console.log(error.message);
          return res.status(404).json({ error: error.message });
      }
  });

  router.get("/recupero02",(req,res)=>{
      let {token}=req.query
  
      try {
          let datosToken=jwt.verify(token, "CoderCoder123")
          res.redirect("http://localhost:8080/recupero02.html?token="+token)
      } catch (error) {
          
          res.redirect("http://localhost:8080/index.html?mensaje=Error token:"+error.message)
  
      }
  })

  router.post("/recupero03",async(req,res)=>{
      let {password, password2, token}=req.body
  
      if(password!==password2){
          res.setHeader('Content-Type','application/json');
          return res.status(400).json({error:`Claves difieren...!!!`})
      }
  
      try {
          let datosToken=jwt.verify(token, "CoderCoder123")
          console.log('estos son los datos del token',datosToken.email)
          let usuario=await usuariosModelo.findOne({email:datosToken.email}).lean()
          if(!usuario){
              res.setHeader('Content-Type','application/json');
              return res.status(400).json({error:`Error de usuario`})
          }
          if(bcrypt.compareSync(password, usuario.password)){
              res.setHeader('Content-Type','application/json');
              return res.status(400).json({error:`Ha ingresado una contraseña utilizada en el pasado. No esta permitido`})
          }
          console.log("llego 01")
          let usuarioActualizado={...usuario, password:bcrypt.hashSync(password, bcrypt.genSaltSync(10))}
          console.log("llego 02")
  
          console.log(usuarioActualizado)
          await usuariosModelo.updateOne({email:datosToken.email}, usuarioActualizado)
          console.log("llego 03")
  
            
          res.status(200).render("login", {
            mensaje: 'Contraseña reseteada exitosamente',
            
          })
      } catch (error) {
          res.setHeader('Content-Type','application/json');
          return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
      }
  
  
  })
  