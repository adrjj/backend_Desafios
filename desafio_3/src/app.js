const express = require ("express")
const app = express()
const PORT = 8080

const productManager= require("./productManager")

app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Endpoint para probar ProductManager
app.get('/test', async (req, res) => {
    try {
        const manager = new productManager();
        const message = await manager.testMethod();
        res.send(message);
    } catch (error) {
        res.status(500).send('Error al probar ProductManager');
    }
});

// Endpoint para obtener productos
app.get('/products', async (req, res) => {
    try {
        const manager = new productManager();
      const limit = req.query.limit; // Obtiene el valor de query limit si está presente
      let products = await manager.loadProducts(); // Método para obtener todos los productos
       
      if (!isNaN(limit)) {
        products = products.slice(0, limit); // Limita la cantidad de productos si se proporciona un límite
      }
  
      res.json(products); // Devuelve los productos en formato JSON
    } catch (error) {
     
        res.status(500).json({ error: 'Error al obtener productos no los carga' });
    }
  });


// Endpoint para obtener un producto por su ID
app.get("/:pid", async (req, res) => {
    try {
        const manager = new productManager();
        const products = await manager.loadProducts();
        const pid = req.params.pid;
       
        const product = products.find(product => product.id === parseInt(pid));

        if (product) {
            res.json(product); // Devuelve el producto encontrado en formato JSON
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto por ID' });
    }
});












app.listen(PORT,()=>{

    console.log("probando coneccion con el puerto 8080")
})
