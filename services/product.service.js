const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../libs/sequelize');

class ProductsService {
  constructor() {}

  // Crea un nuevo producto en la base de datos
  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  // Obtiene todos los productos, incluyendo su categoría asociada
  async find(query) {
    const options = {
      include: ['category'],
      where: {}
    }
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit =  limit;
      options.offset =  offset;
    }
    const {price} = query;
    if (price){
      options.where.price = price;
    }
    const {price_min, price_max} =query;
    if(price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
    }
  
    const products = await models.Product.findAll(options);
    return products;

  }

  // Busca un producto por su clave primaria (ID)
  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category']
    });
    if (!product) {
      throw boom.notFound('Product not found');
    }
    // Si el producto está bloqueado, se lanza un error de conflicto
    if (product.isBlock) {
      throw boom.conflict('Product is blocked');
    }
    return product;
  }

  // Actualiza un producto existente con los cambios dados
  async update(id, changes) {
    // Se obtiene el producto; si no existe se lanzará un error en findOne
    const product = await this.findOne(id);
    // Se actualiza el producto con los nuevos datos
    const updatedProduct = await product.update(changes);
    return updatedProduct;
  }

  // Elimina un producto de la base de datos
  async delete(id) {
    // Se busca el producto; si no existe se lanza un error
    const product = await this.findOne(id);
    // Se elimina el producto
    await product.destroy();
    return { id, message: 'Product deleted successfully' };
  }
}

module.exports = ProductsService;
