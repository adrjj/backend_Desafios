

const fs = require('fs').promises;

class productManager {
    constructor() {
        this.path = "productos.json"
        this.products = []
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            // Validar campos obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Todos los campos son obligatorios.");
            }

            // Validar que el código no se duplique
            if (this.products.some(product => product.code === code)) {
                throw new Error("El código del producto ya existe.");
            }
            const fileExists = await fs.access(this.path).then(() => true).catch(() => false);
            if (!fileExists) {
                // Si el archivo no existe, crearlo con un array vacío
                await fs.writeFile(this.path, '[]');
            }

            const nextProductId = await this.getNextProductId();
            const newProduct = {
                id: nextProductId,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };

            this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log("No se pudo agregar el producto:", error);
            throw error;
        }
    }

    async loadProducts() {

        try {
            const data = await fs.readFile(this.path, "utf8");
            return JSON.parse(data)

        } catch (error) {
            console.log("no se pudo cargar los productos", error)
            throw error;
        }
    }

    async getProducts() {
        try {
            const productosCargados = await manager.loadProducts();
            console.log("Estos son todos los productos:", productosCargados);

        } catch (error) {
            console.log("no se pudo cargar los productos", error)
            throw error;
        }
    }
    async getProductsById(id) {

        const productId = this.products.find(product => product.id === id);
        if (productId) {
            return productId;
        } else {
            throw new Error("No se encontró ningún producto con el ID proporcionado.");
        }

    }

    async updateProduct(id, newData) {
        try {
            // Validar que exista el ID proporcionado
            const index = this.products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }

            // Validar que el nuevo código no se duplique
            if ('code' in newData && newData.code !== this.products[index].code && this.products.some(product => product.code === newData.code)) {
                throw new Error("El nuevo código del producto ya existe.");
            }

            // Actualizar el producto con los nuevos datos
            this.products[index] = { ...this.products[index], ...newData };
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Producto actualizado correctamente.");
        } catch (error) {
            console.log("No se pudo actualizar el producto:", error);
            throw error;
        }
    }



    async deleteProduct(id) {
        try {

            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {

                this.products.splice(index, 1);

                await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
                console.log("Producto eliminado correctamente.");
            } else {
                console.log("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            console.log("No se pudo eliminar el producto:", error);
        }
    }
    async getNextProductId() {
        await this.loadProducts();
        if (this.products.length === 0) {
            return 1; // Si no hay productos, devolver 1 como primer ID
        } else {
            const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
            return Number(maxId) + 1;
        }
    }
}




const manager = new productManager();

(async () => {
    //1º paso Cargamos los producto y se crea el archivo .Json  
    await manager.addProduct("Camisa", "Descripción de la camisa", 20, "imagen.jpg", "12345", 100);
      await manager.addProduct("remera", "Descripción de la remera", 10, "imagen.jpg", "12547", 90);
     await manager.addProduct("celular", "Descripción del celular", 10, "imagen.jpg", "12557", 90);
     await manager.addProduct("mouse", "Descripcion del mouse", 10, "imagen.jpg", "11547", 90);

    //2º cargamos los productos
    //await manager.getProducts();
    
    //3º Probamos los cambios que podemos realizar
   // await manager.updateProduct(1, { title: "BANANA" });
    
    //4º borramos un producto
    //await manager.deleteProduct(1);

    //5º Probamos cargar un producto con code igual
   //await manager.addProduct("teclado", "Descripewqeción de la remewqewqra", 10, "imagen.jpg", "12547", 90);


})();
