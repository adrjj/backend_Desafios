
const productDAO = require("../dao/productDao.js");

class ProductController {
    async getProduct(queryParams) {
        const { limit = 10, page = 1, sort = {}, filter = {} } = queryParams;

        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: Object.keys(sort).length > 0 ? sort : undefined 
        };

        return await productDAO.getProduct(filter, options);
    }

    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        const productData = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category
        };
        return await productDAO.addProduct(productData);
    }

    async getProductById(_id) {
        return await productDAO.getProductById(_id);
    }

    async updateProduct(_id, newData) {
        return await productDAO.updateProduct(_id, newData);
    }

    async deleteProduct(_id) {
        return await productDAO.deleteProduct(_id);
    }

    async loadProducts() {
        return await productDAO.loadProducts();
    }
}

module.exports =  ProductController;
