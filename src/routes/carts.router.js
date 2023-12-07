
import express from 'express';
/* import CartsManager from '../dao/cartsManager.js'; */
import { CartManager } from '../dao/cartsManagerMDB.js';

const router = express.Router();
/* const cartManager = new CartsManager('./src/carts.json'); */
const cartManager = new CartManager ()
// Ruta para crear un nuevo carrito
router.post('/', async(req, res) => {
  /* const newCart = cartManager.createCart();
  res.status(201).json(newCart); */
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Ruta para listar los productos de un carrito específico
router.get('/:cid',async (req, res) => {
  let id = req.params.cid;
  id = parseInt(id);

  if (isNaN(id)) {
    return res.send('Error, ingrese un argumento id numerico');
  }

  /* const cartsData = JSON.parse(fs.readFileSync('./src/carts.json', 'utf-8'));
  const resultado = cartsData.find((car) => car.id === id); */

/*   const resultado = cartManager.getCart(id);

  if (!resultado) {
    res.status(404).json('Carrito no encontrado');
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultado });
  } */

  
  try {
    const resultado = await cartManager.getCart(id);

    if (!resultado) {
      res.status(404).json('Carrito no encontrado');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ resultado });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Ruta para agregar un producto a un carrito específico
router.post('/:cid/product/:pid',async (req, res) => {
  let productId = req.params.pid;
  let id = req.params.cid;
  id = parseInt(id);

  if (isNaN(id)) {
    return res.send('Error, ingrese un argumento id numerico');
  }

  productId = parseInt(productId);

  if (isNaN(productId)) {
    return res.send('Error, ingrese un argumento id numerico');
  }

  /* if (cartManager.addProductToCart(id, productId)) {
    res.status(200).json({ message: 'Producto agregado al carrito con éxito' });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  } */

  try {
    if (await cartManager.addProductToCart(id, productId)) {
      res.status(200).json({ message: 'Producto agregado al carrito con éxito' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default router;

