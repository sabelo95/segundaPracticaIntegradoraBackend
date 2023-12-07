import { ProductModel } from "./models/products.model.js";

export class ManagerProduct {
  async listarUsuarios() {
    try {
      
      return await ProductModel.find().lean();
    } catch (error) {
      
      console.log(error);
      return null;
    }
  }

  async listarUsuariosId(idprod) {
    try {
      
      return await ProductModel.find({ id: idprod }).lean();
    } catch (error) {
      
      console.log(error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      
      const lastProduct = await ProductModel.findOne().sort({ id : -1 }).limit(1).lean();
  
      
      const lastProductId = lastProduct ? lastProduct.id : 0;
      const newProductId = lastProductId + 1;
  
     
      const productWithId = { ...productData, id: newProductId };
  
      
      const newProduct = new ProductModel(productWithId);
  
      
      return await newProduct.save();
    } catch (error) {
      console.error(error);
      throw new Error('Error al agregar el producto');
    }
  }

async updateProductById(id, updatedFields) {
    try {
        const result = await ProductModel.updateOne({ id: id }, { $set: updatedFields });

        if (result.nModified > 0) {
            return true; // Indica que al menos un documento fue modificado
        } else {
            return false; // Indica que no se encontró el producto con el ID dado
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al actualizar el producto por ID');
    }
}

async deleteProductById(id) {
    try {
        const result = await ProductModel.deleteOne({ id: id });

        if (result.deletedCount > 0) {
            return true; // Indica que al menos un documento fue eliminado
        } else {
            return false; // Indica que no se encontró el producto con el ID dado
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al eliminar el producto por ID');
    }
}
}
