console.log("hola");
const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor de Socket.io");
});

socket.on("resultado", function (resultado) {
    
        console.log('Received resultado:', resultado);
    
  var realTimeProductList = document.getElementById("realTimeProductList");

  realTimeProductList.innerHTML = "";

  
  resultado.forEach(function (product) {
    var productDiv = document.createElement("div");
    productDiv.innerHTML = `
            <div>
              <strong>ID:</strong> ${product.id}
              <strong>Title:</strong> ${product.title}<br>
              <strong>Price:</strong> ${product.price}<br>
              
              
            </div>
            <hr>
          `;

    realTimeProductList.appendChild(productDiv);
  });
});

socket.on("productAdded", (data) => {
  console.log(data.message);
  console.log("Nuevo producto:", data.product.producto);

  
  const productId = data.product.producto.id;
  const productTitle = data.product.producto.title;
  const productPrice = data.product.producto.price;

  
  const productsContainer = document.getElementById("productList");

  
  const newProductElement = document.createElement("p");
  newProductElement.innerHTML = `ID: ${productId}, Name: ${productTitle}, Price: ${productPrice}`;

  
  productsContainer.appendChild(newProductElement);

  
});
