const express=require('express')
const ProductManager=require('./productsManager')
const CartsManager=require('./cartsManager')

const PORT=8080
const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/products',(req, res)=>{
    const fs=require('fs')
    let resultado = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
     
   
    if(req.query.limit){
        resultado=resultado.slice(0, req.query.limit)
    }

    res.setHeader('Content-Type','application/json');
    res.status(200).json({filtros: req.query,resultado });
})

app.get('/products/:pid',(req,res)=>{

    let id=req.params.pid
    id=parseInt(id)  
    if(isNaN(id)){
        return res.send('Error, ingrese un argumento id numerico')
    }

    const fs=require('fs')
    let resultado = JSON.parse(fs.readFileSync('products.json', 'utf-8')).find(prod=>prod.id===id)
    if (resultado === null || resultado === undefined) {
        res.status(404).json('producto no encontrado');
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ resultado });
    };
})

app.post('/products', (req, res) => {
    const { title, description, code, price, stock, category, estado, thumbnail } = req.body;
    


  
    if (!title || !description || !code || !price || !stock || !category || !estado ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    } 
  
    const manager = new ProductManager('products.json');
    const addProduct =  manager.addProduct(title, description, price, thumbnail, code, stock, category, estado);  

    if (addProduct) {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: 'Producto agregado con éxito', producto: addProduct });
    } else {
        res.status(400).json({ error: 'Producto no añadido' });
    }

    
    

})

app.post('/products/:pid', (req, res) => {
    let id = req.params.pid;
    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Error, ingrese un argumento id numérico' });
    }

    const { title, description, code, price, stock, category, estado, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category || estado === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const manager = new ProductManager('products.json');
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
    }
});

app.delete('/delete/:pid', (req, res) => {
    let id = req.params.pid;
    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Error, ingrese un argumento id numérico' });
    }

    
   
    const manager = new ProductManager('products.json');
    const deleteProduct = manager.deleteProducto(id)
    
    if (deleteProduct) {
        res.status(200).json({ message: 'Producto eliminado con exito'});
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});



  
  const cartManager = new CartsManager('carts.json');
  
  // Ruta para crear un nuevo carrito
  app.post('/carts', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
  });
  
  // Ruta para listar los productos de un carrito específico
  app.get('/carts/:cid', (req, res) => {
    
    let id=req.params.cid
    id=parseInt(id)  
    if(isNaN(id)){
        return res.send('Error, ingrese un argumento id numerico')
    }

    const fs=require('fs')
    let resultado = JSON.parse(fs.readFileSync('carts.json', 'utf-8')).find(car=>car.id===id)
    if (resultado === null || resultado === undefined) {
        res.status(404).json('Carrito no encontrado');
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ resultado });
    }
    
})
  
  // Ruta para agregar un producto a un carrito específico
  app.post('/carts/:cid/product/:pid', (req, res) => {
    let productId = req.params.pid;
    let id=req.params.cid
    id=parseInt(id)  
    if(isNaN(id)){
        return res.send('Error, ingrese un argumento id numerico')
    }

    productId=parseInt(productId)  
    if(isNaN(productId)){
        return res.send('Error, ingrese un argumento id numerico')
    }
  
    if (cartManager.addProductToCart(id, productId)) {
      res.status(200).json({ message: 'Producto agregado al carrito con éxito' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  });

const server=app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
}) 

