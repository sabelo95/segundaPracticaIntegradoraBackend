import express from "express";
/* import  ProductManager from '../dao/productsManager.js'; */
import { ProductModel } from "../dao/models/products.model.js";
import { ManagerProduct } from "../dao/productsManagerMDB.js";

const router = express.Router();
/* const productManager = new ProductManager('./src/products.json'); */
const productManager = new ManagerProduct();

const auth=(req, res, next)=>{
  if(!req.session.usuario){
      res.redirect('/login')
      return 
  }

  next()
}

router.get("/products",auth, async (req, res) => {
  console.log(req.session.usuario)
  let pagina = 1;
  if (req.query.pagina) {
    pagina = req.query.pagina;
  }

  let limite = null;
  if (req.query.limit) {
    limite = req.query.limit;
  }

  let resultado;
  let preresultado = await productManager.listarUsuarios(pagina, limite);
  let categoria = req.query.categoria
    ? req.query.categoria.toLowerCase()
    : null;
  if (req.query.categoria) {
    console.log("entrando a categoria");

    preresultado = await productManager.listarUsuarios(
      pagina,
      limite,
      undefined, // No es necesario pasar 'categoria' como tercer parámetro aquí
      categoria
    );
  }

  if (req.query.sort) {
    console.log("entrando al sort");
    let sortOrder = req.query.sort === "desc" ? -1 : 1;
    preresultado = await productManager.listarUsuarios(
      pagina,
      limite,
      sortOrder,
      categoria
    );
  }

  resultado = preresultado.docs;

  let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
    preresultado;

  let usuario=req.session.usuario
  let rol=req.session.usuario.rol
  let auto=false
   if (rol==='admin'){
    auto=true
  } 

  res.status(200).render("products", {
    resultado: resultado,
    totalPages,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    usuario,
    auto
  });
});

router.get("/products/:pid", auth, async (req, res) => {
  let id = req.params.pid;
  let idprod = parseInt(id);

  if (isNaN(idprod)) {
    return res.send("Error, ingrese un argumento id numerico");
  }

 

  let resultado = await productManager.listarUsuariosId(idprod);

  res.status(200).render("products", {
    resultado,
  });
});

router.post("/products", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

 
  try {
    const savedProduct = await productManager.addProduct(req.body);
    res
      .status(201)
      .json({ message: "Producto agregado con éxito", producto: savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.post("/products/:pid", async (req, res) => {
  let id = req.params.pid;
  let idprod = parseInt(id);

  if (isNaN(idprod)) {
    return res
      .status(400)
      .json({ error: "Error, ingrese un argumento id numérico" });
  }

  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    estado,
    thumbnail,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !stock ||
    !category ||
    estado === undefined
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
 

  try {
    // Crea un objeto con los campos que deseas actualizar
    const updateFields = {
      title,
      description,
      code,
      price,
      stock,
      category,
      estado,
      thumbnail,
    };

    // Utiliza el método updateProductById del manager para actualizar el producto por ID
    const success = await productManager.updateProductById(
      idprod,
      updateFields
    );

    if (success) {
      res.status(200).json({ message: "Producto actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/delete/:pid", async (req, res) => {
  let id = req.params.pid;
  let idprod = parseInt(id);

  if (isNaN(idprod)) {
    return res
      .status(400)
      .json({ error: "Error, ingrese un argumento id numérico" });
  }

 

  try {
    // Utiliza el método deleteProductById del manager para eliminar el producto por ID
    const success = await productManager.deleteProductById(idprod);

    if (success) {
      res.status(200).json({ message: "Producto eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
