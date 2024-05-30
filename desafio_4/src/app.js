const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http); // Importar el servidor de Socket.IO
const path = require('path');
const exphbs = require("express-handlebars");
const PORT = 8080;

//const productManager = require('../router/products.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del motor de plantillas Handlebars
const hbs = exphbs.create();
app.engine("handlebars", hbs.engine);

// Construir la ruta absoluta al directorio de vistas
const viewsPath = path.join(__dirname, 'views');

// Configurar Express para usar el directorio de vistas
app.set('views', viewsPath);
app.set("view engine", "handlebars");

// Importar el enrutador de productos y carritos
const productRouter = require("../router/products.js");
const cartRouter = require("../router/carts.js");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Configuración de la conexión WebSocket
io.on("connection", (socket) => {
    console.log("Usuario conectado");

    //  eventos de Socket.IO para productos

    socket.on("productAdded", async (newProduct) => {
        try {
            const manager = productRouter.manager;
            // Obtener todos los productos incluyendo el recién agregado
            const productos = await manager.loadProducts();

            // Buscar el producto recién agregado por su código u otro identificador único
            const addedProduct = productos.find(product => product.code === newProduct.code);

            // Emitir el evento "productAdded" con el objeto del producto recién agregado
            io.emit("productAdded", addedProduct);
        } catch (error) {
            console.log("Error al agregar el producto:", error.message);
        }
    });


    // Escuchar el evento 'productDeleted' del cliente
    socket.on("productDeleted", async (productId) => {
        try {
            const managerDelete = productRouter.manager;
            // Llamar a la función deleteProduct con el productId recibido
            await managerDelete.deleteProduct(productId);
            console.log(`Producto con ID ${productId} eliminado correctamente`);

            // Emitir evento al cliente para notificar la eliminación del producto
            io.emit("productDeleted", productId);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});





app.get("/home", async (req, res) => {
    try {
        const manager = productRouter.manager;
        // Obtener todos los productos usando el método de la instancia
        const productos = await manager.loadProducts();

        // Renderizar la vista "home.handlebars" y pasar los productos como contexto
        res.render("home", { productos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos.", message: error.message });
    }
});


app.get("/realtimeproducts", async (req, res) => {
    try {
        const manager = productRouter.manager;
        // Obtener todos los productos usando el método de la instancia
        const productosPromise = manager.loadProducts();
        const productos = await productosPromise; // Esperar a que se resuelva la promesa
        console.log("esto tiene el load product", await productosPromise)
        // Renderizar la vista "realTimeProducts.handlebars" y pasar los productos como contexto
        res.render("realTimeProducts", { productos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos.", message: error.message });
    }
});



http.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
