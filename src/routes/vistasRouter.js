
import express from 'express';
/* import ProductManager from '../dao/productsManager.js'; */
import { ManagerProduct } from '../dao/productsManagerMDB.js';


const router = express.Router();
/* const productManager = new ProductManager('./src/products.json'); */
const productManager = new ManagerProduct ()
router.get('/realTimeProducts',async (req, res) => {
    /* let resultado = JSON.parse(fs.readFileSync('./src/products.json', 'utf-8'));  */
    /*  let resultado=JSON.parse(productManager.getProducts())  */
     
     let resultado = await productManager.listarUsuarios()
    if (req.query.limit) {
        resultado = resultado.slice(0, req.query.limit);
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realTimeProducts', { resultado });
    /*  req.io.emit('resultado',resultado); */
});

router.post('/realTimeProducts', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category /* || !estado */) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

      /* const addProduct = productManager.addProduct(title, description, price, thumbnail, code, stock, category  , estado );

    if (addProduct) {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: 'Producto agregado con éxito', producto: addProduct });
        req.io.emit('productAdded', { message: 'Nuevo producto agregado', product: addProduct });
    } else {
        res.status(400).json({ error: 'Producto no añadido' });
    } */

    try {
        const addProduct = await productManager.addProduct(req.body);
        res.setHeader("Content-Type", "application/json")
        res.status(201).json({ message: 'Producto agregado con éxito', producto: addProduct });
        req.io.emit('productAdded', { message: 'Nuevo producto agregado', product: addProduct})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }

  
});

export default router;

 
 