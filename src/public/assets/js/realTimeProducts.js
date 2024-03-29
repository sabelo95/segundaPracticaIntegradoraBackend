import { logger } from "../../../utils/loggers.js";
logger.info("hola");
const socket = io();

socket.on("connect", () => {
  logger.info("Conectado al servidor de Socket.io");
});

socket.on("resultado", function (resultado) {
  logger.info("Received resultado:", resultado);

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

socket.on("productAdded", async (data) => {
  logger.info(data.message);
  logger.info("Nuevo producto:", data.product);

  try {
    const product = await data.product;

    const productId = product.id;
    const productTitle = product.title;
    const productPrice = product.price;

    const productsContainer = document.getElementById("productList");

    const newProductElement = document.createElement("p");
    newProductElement.innerHTML = `ID: ${productId}, Name: ${productTitle}, Price: ${productPrice}`;

    productsContainer.appendChild(newProductElement);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }

  /* const productId = data.product.producto.id; 
  const productTitle = data.product.producto.title;
  const productPrice = data.product.producto.price; */
});
