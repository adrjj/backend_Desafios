const ProductDAO = require("../dao/productDao.js");
const Repositorie = require("../repositories/productRepository.js")

const CustomError = require('../services/custom.Error'); 
const {generateProductErrorInfo} = require('../services/info'); 
const EErrors = require('../services/enum.js'); 

const ProductRepository = new Repositorie ()


class ProductController {
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, category } = req.query;
    
            let sortQuery = {};
            if (sort === 'price') {
                sortQuery = { price: 1 };
            } else if (sort === '-price') {
                sortQuery = { price: -1 };
            }
    
            const filterQuery = category ? { category } : {};
    
            console.log("Filter Query:", filterQuery);
            console.log("Sort Query:", sortQuery);
            console.log("Limit:", limit, "Page:", page);
    
            const options = {
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                sort: Object.keys(sortQuery).length > 0 ? sortQuery : undefined
            };
    
            const result = await ProductRepository.getProduct(filterQuery, options);
    
            if (!result) {
                throw new Error("No se pudieron obtener los productos.");
            }
    
            const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage, page: currentPage } = result;
    
            res.json({
                status: 'success',
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `?limit=${limit}&page=${prevPage}&sort=${sort || ''}&category=${category || ''}` : null,
                nextLink: hasNextPage ? `?limit=${limit}&page=${nextPage}&sort=${sort || ''}&category=${category || ''}` : null
            });
        } catch (error) {
            res.status(500).json({ error: "Error al recuperar productos.", message: error.message });
        }
    }
    

   /* async addProduct(req, res) {
        try {
            const { title, description, price, thumbnail, code, stock, category, status } = req.body;
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                return res.status(400).json({ error: "Todos los campos son obligatorios." });
            }
            const productData = { title, description, price, thumbnail, code, stock, status, category };
            await ProductRepository.addProduct(productData);
            res.status(201).json({ message: "Producto agregado exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto.", message: error.message });
        }
    }*/
        async addProduct(req, res) {
            try {
                const { title, description, price, thumbnail, code, stock, category, status } = req.body;
        
                // Verifica si todos los campos obligatorios están presentes
                if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                    const errorMessage = generateProductErrorInfo({ title, description, price, thumbnail, code, stock, category });
                    CustomError.createError({
                        name: "ValidationError",
                        cause: errorMessage,
                        message: "Error en la creación del producto",
                        code: EErrors.INVALID_TYPES_ERROR
                    });
                }
        
                const productData = { title, description, price, thumbnail, code, stock, status, category };
                await ProductRepository.addProduct(productData);
                res.status(201).json({ message: "Producto agregado exitosamente." });
            } catch (error) {
                console.error(error); // Imprime el error completo en la consola
                res.status(500).json({ error: "Error al agregar el producto.", message: error.message });
            }
        }
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductRepository.getProductById(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: "Error al recuperar el producto.", message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const newData = req.body;
            await ProductRepository.updateProduct(id, newData);
            res.status(200).json({ message: "Producto actualizado exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el producto.", message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await ProductRepository.deleteProduct(id);
            res.status(200).json({ message: "Producto eliminado exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto.", message: error.message });
        }
    }

    async loadProducts() {
        return await ProductRepository.loadProducts();
    }


    
}

module.exports = ProductController;
