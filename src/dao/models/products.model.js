import mongoose from 'mongoose';
import  paginate  from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: false
    },
    id: {
        type: Number,
        required: false,
        unique: true
    }
    
    
},

{
    strict : false
}
);

productSchema.plugin(paginate) 

const ProductModel = mongoose.model('products', productSchema);

export { ProductModel };
