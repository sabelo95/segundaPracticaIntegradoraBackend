console.log("hola");
const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor de Socket.io");
});

socket.on("resultado", function (resultado) {
    
        console.log('Received resultado:', resultado);
    
  var realTimeProductList = document.getElementById("realTimeProductList");

  // Clear previous content
  realTimeProductList.innerHTML = "";

  // Loop through the resultado and render each product
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

  // Accede a las propiedades del producto
  const productId = data.product.producto.id;
  const productTitle = data.product.producto.title;
  const productPrice = data.product.producto.price;

  // Obtén el contenedor de productos
  const productsContainer = document.getElementById("productList");

  // Crea un nuevo elemento de párrafo con la información del nuevo producto
  const newProductElement = document.createElement("p");
  newProductElement.innerHTML = `ID: ${productId}, Name: ${productTitle}, Price: ${productPrice}`;

  // Agrega el nuevo producto al contenedor
  productsContainer.appendChild(newProductElement);

  // Resto del código según sea necesario
});
