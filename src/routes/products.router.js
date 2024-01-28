import express from "express";
import { productsController } from "../controller/products.controller.js";

const router = express.Router();

const auth=(req, res, next)=>{
  if(!req.session.usuario){
      res.redirect('/login')
      return 
  }

  next()
}

router.get("/products", auth, productsController.getCart );

router.get("/products/:pid", auth, productsController.getOneProduct);

router.post("/products", productsController.postProduct);

router.post("/products/:pid",productsController.actProduct);

router.delete("/delete/:pid", productsController.deleteProd);

export default router;
