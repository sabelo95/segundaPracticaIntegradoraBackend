import { cartsController } from "../controller/carts.controller.js";
import express from "express";



const router = express.Router();


const auth = (req, res, next) => {
  if (!req.session.usuario) {
    res.redirect("/login");
    return;
  }

  next();
};

router.post("/",auth, cartsController.postCarts);
// Ruta para listar los productos de un carrito específico
router.get("/:cid", auth, cartsController.getOneCart);
// Ruta para agregar un producto a un carrito específico
router.post("/:cid/addproduct/:pid",auth, cartsController.postProductOnCart);

router.get("/:cid/purchase", auth, cartsController.generateTicket)
// ruta para actualizar cantidades de producto
router.post("/:cid/product/:pid",auth, cartsController.postProductOnCartAct);

router.delete("/:cid/product/:pid",auth, cartsController.deleteCart);



export default router;
