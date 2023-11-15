 const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");

const PORT = 8080;

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));

const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const realTimeProducts = require("./routes/vistasRouter");

app.use("/api", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/",(req, res, next)=>{
  
  req.io=io

  next()
}, realTimeProducts); 

const server = app.listen(PORT, () => {
  console.log(`Server on line en puerto ${PORT}`);
});

const io = new Server(server);
 








