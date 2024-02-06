import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productInCartSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios'},
    products: [productInCartSchema]
});



cartSchema.plugin(paginate);
const CartModel = mongoose.model('carts', cartSchema);

export { CartModel }; 

