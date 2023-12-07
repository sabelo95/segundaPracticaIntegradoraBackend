import { CartModel } from './models/carts.model.js';

export class CartManager {
    async createCart() {
        try {
            const existingCarts = await CartModel.find();
            const cartId = existingCarts.length;
            
            const newCart = new CartModel({ id: cartId, products: [] });
            await newCart.save();

            return newCart;
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear el carrito');
        }
    }

    async getCart(cartId) {
        try {
            const cart = await CartModel.findOne({ id: cartId }).lean();
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener el carrito');
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await CartModel.findOne({ id: cartId });
            
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const existingProductIndex = cart.products.findIndex(product => product.id === productId);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = (cart.products[existingProductIndex].quantity || 0) + 1;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }

            await cart.save();

            return true;
        } catch (error) {
            console.error(error);
            throw new Error('Error al agregar el producto al carrito');
        }
    }
}

