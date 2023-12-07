import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    quantity: { type: Number, required: true }
});


const cartSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    products: [productSchema] 
});


const CartModel = mongoose.model('carts', cartSchema);

export { CartModel };