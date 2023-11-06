class CartManager {
    constructor(path) {
      this.carts = {};
      this.path=path
    }
  
    createCart() {
        const fs = require('fs');
        let existingData = [];
        if (fs.existsSync(this.path)) {
            const fileContent = fs.readFileSync(this.path, 'utf-8');
            existingData = JSON.parse(fileContent);
        }
    
      const cartId = existingData.length;
      this.carts[cartId] = { id: cartId, products: [] };
      existingData.push(this.carts[cartId]);
     fs.writeFileSync(this.path, JSON.stringify(existingData, null, '\t'));
      return this.carts[cartId];
    }
  
    getCart(cartId) {
      return this.carts[cartId];
    }
  
    addProductToCart(cartId, productId) {
        
      
        const cart = this.carts[cartId];
        const existingProductIndex = cart.products.findIndex((product) => product.id === productId);
      
        if (existingProductIndex !== -1) {
          // Si el producto ya existe en el carrito, incrementa su cantidad
          cart.products[existingProductIndex].quantity = (cart.products[existingProductIndex].quantity || 0) + 1;
        } else {
          // Si el producto no existe, agrégalo al carrito
          cart.products.push({ id: productId, quantity: 1 });
        }
      
        return true;
      }
    }

    module.exports = CartManager;
