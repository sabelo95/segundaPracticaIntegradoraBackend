

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { MessageModel } from './dao/models/messages.model.js';

const PORT = 8080;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));


import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import realTimeProducts from "./routes/vistasRouter.js";

app.use("/api", productRouter);
app.get('/chat',(req,res)=>{


  res.status(200).render('chat')
})

app.use("/api/carts", cartsRouter);
app.use("/", (req, res, next) => {
  req.io = io;
  next();
}, realTimeProducts);

const server = app.listen(PORT, () => {
  console.log(`Server on line en puerto ${PORT}`);
});

const io = new Server(server);

try {
  await mongoose.connect('mongodb+srv://santiagoberriolopez:mecanica95@cluster0.d1pj6rg.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce')
  console.log('DB Online')
  
} catch (error) {
  console.log(error)
}

let usuarios=[]
let mensajes=[]

io.on("connection", socket => {
  console.log(`Se ha conectado un cliente con id ${socket.id}`);

  socket.on('id', async nombre => {
      usuarios.push({ nombre, id: socket.id });
      socket.broadcast.emit('nuevoUsuario', nombre);

      
      try {
          const mensajes = await MessageModel.find({}).lean();
          socket.emit("hello", mensajes);
      } catch (error) {
          console.error('Error al obtener mensajes de la base de datos:', error);
      }
  });

  
socket.on('mensaje', async datos => {
  
  const nuevoMensaje = new MessageModel({
    messages: [{ user: datos.emisor, message: datos.mensaje }]
});

try {
    const mensajeGuardado = await nuevoMensaje.save();
    console.log('Mensaje guardado en la base de datos:', mensajeGuardado);

    io.emit('nuevoMensaje', datos);
} catch (error) {
    console.error('Error al guardar el mensaje en la base de datos:', error);
}

});


  socket.on("disconnect",()=>{
      let usuario=usuarios.find(u=>u.id===socket.id)
      if(usuario){
          io.emit("usuarioDesconectado", usuario.nombre)
      }
  })

})









