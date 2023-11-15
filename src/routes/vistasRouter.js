const express = require('express');
const router = express.Router();
const ProductManager=require('../productsManager')





router.get('/realTimeProducts',(req, res)=>{
    const fs=require('fs')
    let resultado = JSON.parse(fs.readFileSync('./src/products.json', 'utf-8'));
     
   
    if(req.query.limit){
        resultado=resultado.slice(0, req.query.limit)
    }
    
     res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts',{resultado});   
   /*  req.io.emit('resultado',resultado); */
})

router.post('/realTimeProducts', (req, res) => {
    const { title, description, code, price, stock, category, /* estado,  */thumbnail } = req.body;
    


  
    if (!title || !description || !code || !price || !stock || !category /* || !estado */ ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    } 
  
    const manager = new ProductManager('./src/products.json');
    const addProduct =  manager.addProduct(title, description, price, thumbnail, code, stock, category/* , estado */);  

    if (addProduct) {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: 'Producto agregado con éxito', producto: addProduct });
        req.io.emit('productAdded', { message: 'Nuevo producto agregado', product: addProduct });
    } else {
        res.status(400).json({ error: 'Producto no añadido' });
    }
})




module.exports = router;
 
