const knex = require('../database/knex/index');

class UserRepository {
  async findByEmail(email) {
    const user = await knex('users').where('email', email).first();
    return user;
  }

  async create({ name, email, password }) {
    const [createdUser] = await knex('users')
      .insert({ name, email, password })
      .returning('id');

    return { id: createdUser };
  }

  async update({ id, name, email, password }) {
    await knex('users')
      .where('id', id)
      .update({ name, email, password, updated_at: knex.fn.now() });
  }
}

module.exports = UserRepository;
