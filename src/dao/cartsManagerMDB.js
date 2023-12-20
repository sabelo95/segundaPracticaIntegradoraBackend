import { CartModel } from "./models/carts.model.js";

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
      throw new Error("Error al crear el carrito");
    }
  }

  async getCart(cartId) {
    try {
      const cart = await CartModel.findOne({ id: cartId })
        .populate("products.product")
        .lean();
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      console.log(cartId, productId);
      const cart = await CartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProductIndex = cart.products.findIndex((product) =>
        product.product.equals(productId)
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity =
          (cart.products[existingProductIndex].quantity || 0) + 1;
        console.log("hola");
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      return true;
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar el producto al carrito");
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findOneAndUpdate(
        { id: cartId, "products.product": productId },
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      if (cart) {
        return true;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el producto del carrito");
    }
  }
  async updateProductQuantityInCart(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findOneAndUpdate(
        { id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": newQuantity } },
        { new: true }
      );

      if (cart) {
        return true;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error al actualizar la cantidad del producto en el carrito"
      );
    }
  }
}
