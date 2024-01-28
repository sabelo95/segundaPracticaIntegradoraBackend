import { productMongoDAO } from "../dao/productsMongoDao.js";

export class ManagerProduct {
  async listarProductos(pagina, limite, sortOrder, categoria) {
    if (limite === null) {
      limite = 10;
    }
    /* try {
      
      return await ProductModel.paginate(
        {},
        {
          lean: true,
          limit: limite,
          page: pagina,
          sort: sortOrder ? { price: sortOrder } : undefined,
        }
      ); */
    try {
      console.log(categoria);
      const query = categoria ? { category: categoria } : {};
      return productMongoDAO.getPaginate(query,limite,pagina,sortOrder)
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listarProductosId(idprod) {
    try {
      return await ProductModel.find({ id: idprod }).lean();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      const lastProduct = await productMongoDAO.get()

      const lastProductId = lastProduct ? lastProduct.id : 0;
      const newProductId = lastProductId + 1;

      const productWithId = { ...productData, id: newProductId };

      

      return await productMongoDAO.create(productWithId)
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar el producto");
    }
    
  }

  async updateProductById(id, updatedFields) {
    try {
      const result = await productMongoDAO.update(id,updatedFields)

      if (result.nModified > 0) {
        return true; // Indica que al menos un documento fue modificado
      } else {
        return false; // Indica que no se encontró el producto con el ID dado
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw new Error("Error al eliminar el producto por ID");
    }
  }
}
