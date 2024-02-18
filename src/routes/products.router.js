import express from "express";
import { productsController } from "../controller/products.controller.js";
import { auth,authAdmin,authUser } from "../utils/utils.js";



const router = express.Router();



router.get("/products", auth, productsController.getCart );

router.get("/crudProduct", auth,authAdmin, productsController.crud )

router.get("/products/:pid", auth, productsController.getOneProduct);

router.post("/products",auth, productsController.postProduct);

router.post("/productsAct",productsController.actProduct);

router.delete("/delete/:pid",auth, productsController.deleteProd);

export default router;
