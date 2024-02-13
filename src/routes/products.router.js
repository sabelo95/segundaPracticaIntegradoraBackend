import express from "express";
import { productsController } from "../controller/products.controller.js";
import { auth,authAdmin,authUser } from "../utils/utils.js";
import { CustomError } from '../utils/CustomErrors.js';
import { ERRORES_INTERNOS, STATUS_CODES } from '../utils/tiposError.js';
import { errorArgumentos } from '../utils/errores.js';

const router = express.Router();



router.get("/products", auth, productsController.getCart );

router.get("/crudProduct", auth,authAdmin, productsController.crud )

router.get("/products/:pid", auth, productsController.getOneProduct);

router.post("/products", productsController.postProduct);

router.post("/productsAct",auth,productsController.actProduct);

router.delete("/delete/:pid",auth, productsController.deleteProd);
router.post("/products1", (req,res)=>{
    throw CustomError.CustomError("Complete campos", "Falta completar los campos requeridos", STATUS_CODES.ERROR_ARGUMENTOS, ERRORES_INTERNOS.ARGUMENTOS, errorArgumentos(req.body))
});

export default router;
