import mongoose from "mongoose";
import { ProductModel } from "./models/products.model.js";
import { CustomError } from '../utils/CustomErrors.js';
import { ERRORES_INTERNOS, STATUS_CODES } from '../utils/tiposError.js';
import { errorArgumentosDB } from '../utils/errores.js';

try {
    await mongoose.connect(
      "mongodb+srv://santiagoberriolopez:mecanica95@cluster0.d1pj6rg.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce"
    );
    console.log("DB Online");
  } catch (error) {
    throw CustomError.CustomError("Error", "Error al conectar a la base de datos", STATUS_CODES.ERROR_AUTENTICACION, ERRORES_INTERNOS.DATABASE, errorArgumentosDB())
  }

  export class productMongoDAO{

    static async getPaginate(query,limite,pagina,sortOrder){
       return await ProductModel.paginate(
            query, // Aquí es donde van las condiciones de filtro, incluyendo 'category' si es necesario
            {
              lean: true,
              limit: limite,
              page: pagina,
              sort: sortOrder ? { price: sortOrder } : undefined,
            }
          );
    }

    static async get(){
     return ProductModel.findOne()
        .sort({ id: -1 })
        .limit(1)
        .lean();
    }

    static async getProduct(id){
      return ProductModel.findOne(id)
         .sort({ id: -1 })
         .limit(1)
         .lean();
     }

    static async create(id){
      const newProduct = new ProductModel(id);

      return await newProduct.save();

    }

    static async update(id,updatedFields){
     return  ProductModel.updateOne(
        { id: id },
        { $set: updatedFields })
    }

    static async delete(id){
      return ProductModel.deleteOne({ id: id });
    }
  }
    