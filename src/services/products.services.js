import { productMongoDAO } from "../dao/productsMongoDao.js";
import { CustomError } from '../utils/CustomErrors.js';
import { ERRORES_INTERNOS, STATUS_CODES } from '../utils/tiposError.js';
import { errorCreaProd } from '../utils/errores.js';
import { logger } from "../utils/loggers.js";

export class ManagerProduct {
  async listarProductos(pagina, limite, sortOrder, categoria) {
    if (limite === null) {
      limite = 10;
    }
   
    try {
      logger.info(categoria)
      const query = categoria ? { category: categoria } : {};
      return productMongoDAO.getPaginate(query,limite,pagina,sortOrder)
    } catch (error) {
      logger.error(error)
      return null;
    }
  }

  async listarProductosId(idprod) {
    try {
      return await ProductModel.find({ id: idprod }).lean();
    } catch (error) {
      logger.error(error)
      return null;
    }
  }

  async addProduct(productData) {
    try { 
      const lastProduct = await productMongoDAO.get()
      
      logger.info(lastProduct)
      const lastProductId = lastProduct ? lastProduct.id : 0;
      const newProductId = lastProductId + 1;

      const productWithId = { ...productData, id: newProductId };

      

      return await productMongoDAO.create(productWithId)
    } catch (error) {
       
      
      throw CustomError.CustomError("Error", "Error al crear el producto", STATUS_CODES.ERROR_ARGUMENTOS, ERRORES_INTERNOS.ARGUMENTOS, errorCreaProd());
    } 
    
  }

  async updateProductById(id, updatedFields) {
    try {
      const result = await productMongoDAO.update(id,updatedFields)

      if (result.modifiedCount !== undefined) {
        if (result.modifiedCount > 0) {
          return true; // Indica que al menos un documento fue modificado
        } else {
          return false; // Indica que no se encontró el producto con el ID dado
        }
      }
      
    } catch (error) {
      logger.error(error)
      throw new Error("Error al actualizar el producto por ID");
    }
  }

  async deleteProductById(id) {
    try {
      const result = await productMongoDAO.delete(id)

      if (result.deletedCount > 0) {
        return true; // Indica que al menos un documento fue eliminado
      } else {
        return false; // Indica que no se encontró el producto con el ID dado
      }
    } catch (error) {
      logger.error(error)
      throw new Error("Error al eliminar el producto por ID");
    }
  }


  async  updateProductQuantities(carrito) {
    try {
      let noStock=[]
      let productsStock=[]
      for (const product of carrito.products) {
          const productId = product.product.id;
          const quantity = product.quantity;

          // Get the existing product from the database
          const existingProduct = await productMongoDAO.getProduct({ id: productId });
          
          if (existingProduct) {
              // Subtract the quantity from the existing stock
              let updatedStock = existingProduct.stock - quantity;
              //si no hay stock agregamos producto a nostock
              if (updatedStock<0){
                noStock.push(product)
                updatedStock = existingProduct.stock
                logger.info(noStock)
              }else{
                productsStock.push(product)
              }
              // Update the stock in the database
              const updated = await productMongoDAO.update(productId, { stock: updatedStock });
              
              if (!updated) {
                logger.info(`Product with ID ${productId} not found or not updated.`);
              }
              
          } else {
            logger.info(`Product with ID ${productId} not found in the database.`);
          }
      }
      
      return { noStock: noStock, productsStock: productsStock }
    } catch (error) {
        logger.error("Error updating product quantities:", error);
        // Handle the error as needed
    }
  }
}


