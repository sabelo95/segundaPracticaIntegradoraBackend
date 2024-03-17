import express from "express";
import { productsController } from "../controller/products.controller.js";
import { auth,authAdmin,authUser,authPremium } from "../utils/utils.js";



const router = express.Router();



router.get("/products",  productsController.getCart );

router.get("/crudProduct",authAdmin, productsController.crud )

router.get("/products/:pid",  productsController.getOneProduct);

router.post("/products", productsController.postProduct);

router.post("/productsAct",productsController.actProduct);

router.post("/delete",authAdmin, productsController.deleteProd);

export default router;
