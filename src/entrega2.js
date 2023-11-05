class ProductManager {
    constructor(path) {
        this.products = [];
        this.path=path
    }

    addProduct(title, description, price, thumbnail, code, stock) {
       
        const missingFields = [];
    
        
        if (!title) {
            missingFields.push("Título");
        }
        if (!description) {
            missingFields.push("Descripción");
        }
        if (!price) {
            missingFields.push("Precio");
        }
        if (!thumbnail) {
            missingFields.push("Thumbnail");
        }
        if (!code) {
            missingFields.push("Código");
        }
        if (stock === undefined) {
            missingFields.push("Stock");
        }
    
        if (missingFields.length > 0) {
            console.log(`Los siguientes campos son obligatorios y faltan: ${missingFields.join(", ")}`);
        } else if (this.products.find((prod) => prod.code === code)) {
            console.log(`El producto con código ${code} ya existe`);
        } else {
            let id = this.products.length;
            this.products.push({ title, description, price, thumbnail, code, stock, id });
        }

        const fs=require('fs')
        fs.writeFileSync(this.path, JSON.stringify(this.products,null,'\t'))
    }
    

    getProducts(){
        const fs=require('fs')
        console.log(JSON.parse(fs.readFileSync(this.path, "utf-8")))
        
    }

    getProdcutsById(id){
        const fs=require('fs')
        const lectura = fs.readFileSync(this.path, 'utf-8');
        const arrayJSON = JSON.parse(lectura);
        arrayJSON.find((prod) => prod.id === id) ?
        console.log(this.products.find((prod) => prod.id === id)) :
        console.log('Not found');

       
        
    }

   /*  updateProduct(title, description, price, thumbnail, code, stock, id) {
        const fs = require('fs');
        const lectura = fs.readFileSync(this.path, 'utf-8');
        const arrayJSON = JSON.parse(lectura);
    
        const updatedArray = arrayJSON.map((prod) => {
            if (prod.id === id) {
                return {
                    ...prod,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock,
                };
            } else {
                return prod;
            }
        });
    
        fs.writeFileSync(this.path, JSON.stringify(updatedArray, null, '\t'));
    
        return updatedArray;
    }
 */

    updateProduct(id, updates) {
        const fs = require('fs');
        const lectura = fs.readFileSync(this.path, 'utf-8');
        const arrayJSON = JSON.parse(lectura);
    
        const updatedArray = arrayJSON.map((prod) => {
            if (prod.id === id) {
                return {
                    ...prod,
                    ...updates,
                };
            } else {
                return prod;
            }
        });
    
        fs.writeFileSync(this.path, JSON.stringify(updatedArray, null, '\t'));
    
        return updatedArray;
    }
    
    deleteProducto(id){
        const fs = require('fs');
        const lectura = fs.readFileSync(this.path, 'utf-8');
        const arrayJSON = JSON.parse(lectura);
        const updatedArray = arrayJSON.filter(prod => prod.id !== id); 
            

        
        fs.writeFileSync(this.path, JSON.stringify(updatedArray, null, '\t'));
    
        return updatedArray;
            
                
    }
}    

const manager = new ProductManager('archivo.json');
manager.addProduct('play','play station', 2000,'lalalal',3,30);
manager.addProduct('play','play station', 2000,'lalalal',2,30);
manager.updateProduct('xbox','xbox', 2000,'lalalal',2,30,1);
manager.updateProduct(0,{title: 'nintento', code: 50});






