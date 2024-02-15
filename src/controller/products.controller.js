import { ManagerProduct } from "../services/products.services.js";
import { CartManager } from "../services/carts.services.js";
import { usuariosModelo } from "../dao/models/usuarios.modelo.js";
import { CustomError } from '../utils/CustomErrors.js';
import { ERRORES_INTERNOS, STATUS_CODES } from '../utils/tiposError.js';
import { errorArgumentos,errorArgumentosDel } from '../utils/errores.js';



const cartManager = new CartManager()
const productManager = new ManagerProduct();

export class productsController {
  constructor() {}

  static async getCart(req, res) {
    try {

      
      let userCar = req.user._id;
      const newCart = await cartManager.createCart(userCar);
      console.log("carrito nuevo",  newCart);

      let updateUsuario = await usuariosModelo.findOne({
        email: req.session.usuario.email,
      });

      updateUsuario.car =  await newCart._id;
      await updateUsuario.save();
 
      
      updateUsuario = await usuariosModelo.findOne({ email: req.session.usuario.email }).lean()

      let usuario = updateUsuario; 
      let rol = updateUsuario.rol;
      let auto = false
      let autoUser= false; 

      console.log("usuario en sesion es" + updateUsuario);

      let pagina = 1;
      if (req.query.pagina) {
        pagina = req.query.pagina;
      }

      let limite = null;
      if (req.query.limit) {
        limite = req.query.limit;
      }

      let resultado;
      let preresultado = await productManager.listarProductos(pagina, limite);
      let categoria = req.query.categoria
        ? req.query.categoria.toLowerCase()
        : null;

      if (req.query.categoria) {
        console.log("entrando a categoria");
        preresultado = await productManager.listarProductos(
          pagina,
          limite,
          undefined,
          categoria
        );
      }

      if (req.query.sort) {
        console.log("entrando al sort");
        let sortOrder = req.query.sort === "desc" ? -1 : 1;
        preresultado = await productManager.listarProductos(
          pagina,
          limite,
          sortOrder,
          categoria
        );
      }

      resultado = preresultado.docs;

      let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
        preresultado;

      if (rol === "admin") {
        auto = true;
      }

      if (rol === "usuario") {
       autoUser = true;
      }

     

      res.status(200).render("products", {
        resultado: resultado,
        totalPages,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        usuario,
        auto,
        autoUser
      });
    } catch (error) {
      // Manejar errores aquí
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async crud(req, res) {
    try {
      res.status(200).render("CRUDproducts");
    } catch (error) {
      // Manejar errores aquí
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }


 static async getOneProduct (req, res){
    let id = req.params.pid;
    let idprod = parseInt(id);
  
    if (isNaN(idprod)) {
      return res.send("Error, ingrese un argumento id numerico");
    }
  
   
  
    let resultado = await productManager.listarProductosId(idprod);
  
    res.status(200).render("products", {
      resultado,
    });
  }

  static async postProduct(req, res){

  
    const { title, description, code, price, stock, category, thumbnail } =
      req.body;

      
  
      if (!title || !description || !code || !price || !stock || !category) {
     
      res.status(400).send("Complete todos los campos");
    } 
   
   
    try {
      const savedProduct = await productManager.addProduct(req.body);
      res
        .status(201)
        .json({ message: "Producto agregado con éxito", producto: savedProduct });
    } catch (error) {
      res.status(500).json({ error: error }); 
    }
    
  }

 static  async actProduct(req, res){
    
  
    const {
      id,
      title,
      description,
      code,
      price,
      stock,
      category,
      estado=true,
      thumbnail,
    } = req.body;

    
  
    if (
      !id ||
      !title ||
      !description ||
      !code ||
      !price ||
      !stock ||
      !category ||
      estado === undefined
    ) {
      res.status(400).send("Complete todos los campos");
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
        id,
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
  }

  static async deleteProd(req, res){
    let id = req.params.pid;
    let idprod = parseInt(id);
  
    if (isNaN(idprod)) {
      res.status(400).json({ error: "Id no valido" });
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
  }
}
