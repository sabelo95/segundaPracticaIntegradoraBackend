import express from "express";
/* import CartsManager from '../dao/cartsManager.js'; */
import { CartManager } from "../dao/cartsManagerMDB.js";

const router = express.Router();
/* const cartManager = new CartsManager('./src/carts.json'); */
const cartManager = new CartManager();
// Ruta para crear un nuevo carrito

const auth=(req, res, next)=>{
  if(!req.session.usuario){
      res.redirect('/login')
      return
  }

  next()
}


router.post("/", async (req, res) => {
  /* const newCart = cartManager.createCart();
  res.status(201).json(newCart); */
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Ruta para listar los productos de un carrito específico
router.get("/:cid", auth,  async (req, res) => {
  let id = req.params.cid;
  id = parseInt(id);

  if (isNaN(id)) {
    return res.send("Error, ingrese un argumento id numerico");
  }

  

  try {
    const resultado = await cartManager.getCart(id);
    console.log(resultado);

    if (!resultado) {
      res.status(404).json("Carrito no encontrado");
    } else {
      res.setHeader("Content-Type", "text/html");
      res.status(200).render("carrito", { resultado });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// Ruta para agregar un producto a un carrito específico
router.post("/:cid/addproduct/:pid", async (req, res) => {
  let productId = req.params.pid;
  let id = req.params.cid;
  id = parseInt(id);

  if (isNaN(id)) {
    return res.send("Error, ingrese un argumento id numerico");
  }

  try {
    if (await cartManager.addProductToCart(id, productId)) {
      res
        .status(200)
        .json({ message: "Producto agregado al carrito con éxito" });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito " });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const productId = req.params.pid;
  let id = req.params.cid;
  id = parseInt(id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "Error, ingrese un argumento id numérico" });
  }

  const newQuantity = req.body.quantity;
  console.log(newQuantity);

  try {
    if (newQuantity !== undefined && newQuantity !== null) {
      // Actualiza la cantidad del producto en el carrito
      if (
        await cartManager.updateProductQuantityInCart(
          id,
          productId,
          newQuantity
        )
      ) {
        res
          .status(200)
          .json({ message: "Cantidad del producto actualizada con éxito" });
      } else {
        res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
    } else {
      res
        .status(400)
        .json({ error: "La cantidad del producto no se proporcionó" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  let productId = req.params.pid;
  let id = req.params.cid;
  id = parseInt(id);

  if (isNaN(id)) {
    return res.send("Error, ingrese un argumento id numerico");
  }

  try {
    if (await cartManager.removeProductFromCart(id, productId)) {
      res.status(200).json({ message: "Producto eliminado con exito" });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
