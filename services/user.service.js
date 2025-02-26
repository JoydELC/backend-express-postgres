const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class UserService {
  constructor() {}

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async find() {
    const users = await models.User.findAll({
      include: ['customer']
    });
    if (users.length === 0) {
      throw boom.notFound('No users found');
    }
    return users;
  }

  async findOne(id) {
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid ID format');
    }
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { message: `User with id ${id} deleted successfully` };
  }
}

module.exports = UserService;