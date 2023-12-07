
import express from 'express';
/* import  ProductManager from '../dao/productsManager.js'; */
import { ProductModel } from '../dao/models/products.model.js';
import { ManagerProduct } from '../dao/productsManagerMDB.js';


const router = express.Router();
/* const productManager = new ProductManager('./src/products.json'); */
    const productManager = new ManagerProduct ()
router.get('/products',async (req, res) => {
   /*  let resultado = JSON.parse(fs.readFileSync('./src/products.json', 'utf-8')); */
   /* let resultado = JSON.parse(productManager.getProducts()) */
   
   let resultado = await productManager.listarUsuarios()
   if (req.query.limit) {
     resultado = resultado.slice(0, req.query.limit);
} 
    res.status(200).render('home', {
        resultado
    });


    

   
   
});

router.get('/products/:pid',async (req, res) => {
    let id = req.params.pid;
    let idprod = parseInt(id);

    if (isNaN(idprod)) {
        return res.send('Error, ingrese un argumento id numerico');
    }

    /* const resultado = JSON.parse(fs.readFileSync('./src/products.json', 'utf-8')).find(prod => prod.id === id); */
    /* const resultado =productManager.getProductsById(id) */

    let resultado = await productManager.listarUsuariosId(idprod)
   
     res.status(200).render('home', {
         resultado
     });
        
    
});

router.post('/products', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    /* const addProduct = productManager.addProduct(title, description, price, thumbnail, code, stock, category);

    if (addProduct) {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: 'Producto agregado con éxito', producto: addProduct });
    } else {
        res.status(400).json({ error: 'Producto no añadido' });
    } */

    try {
        const savedProduct = await productManager.addProduct(req.body);
        res.status(201).json({ message: 'Producto agregado con éxito', producto: savedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.post('/products/:pid', async (req, res) => {
    let id = req.params.pid;
    let idprod = parseInt(id);

    if (isNaN(idprod)) {
        return res.status(400).json({ error: 'Error, ingrese un argumento id numérico' });
    }

    const { title, description, code, price, stock, category, estado, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category || estado === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
/* 
    const manager = new ProductManager('./src/products.json');
    const updatedProducts = manager.updateProduct(id, {
        title,
        description,
        code,
        price,
        stock,
        category,
        estado,
        thumbnail
    });

    if (updatedProducts) {
        res.status(200).json({ message: 'Producto Modificado con éxito' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    } */

    try {
        // Crea un objeto con los campos que deseas actualizar
        const updateFields = {
            title,
            description,
            code,
            price,
            stock,
            category,
            estado,
            thumbnail
        };

        // Utiliza el método updateProductById del manager para actualizar el producto por ID
        const success = await productManager.updateProductById(idprod, updateFields);

        if (success) {
            res.status(200).json({ message: 'Producto actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/delete/:pid',async (req, res) => {
    let id = req.params.pid;
    let idprod = parseInt(id);

    if (isNaN(idprod)) {
        return res.status(400).json({ error: 'Error, ingrese un argumento id numérico' });
    }

   /*  const deleteProduct = productManager.deleteProducto(id);

    if (deleteProduct) {
        res.status(200).json({ message: 'Producto eliminado con exito' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    } */

    try {
        // Utiliza el método deleteProductById del manager para eliminar el producto por ID
        const success = await productManager.deleteProductById(idprod);

        if (success) {
            res.status(200).json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }


});

export default router;

