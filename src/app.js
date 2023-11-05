const express=require('express')

const PORT=3000

const app=express()

app.get('/products',(req, res)=>{
    const fs=require('fs')
    let resultado = JSON.parse(fs.readFileSync('archivo.json', 'utf-8'));
     
   
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
    let resultado = JSON.parse(fs.readFileSync('archivo.json', 'utf-8')).find(prod=>prod.id===id);
    res.setHeader('Content-Type','application/json');
    res.status(200).json({resultado});
})


const server=app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})