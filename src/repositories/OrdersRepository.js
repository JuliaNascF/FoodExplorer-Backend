const knex = require("../database/knex/index");

class OrdersRepository {
  async create(orderStatus, total_amount, payment_method, userId, items) {
    const result = await knex('orders')
      .insert({
        orderStatus,
        total_amount,
        payment_method,
        userId,
        items
      })
      .returning('id');
      
    return result[0];
  }

  async findAll() {
    const result = await knex('orders').select('*');
    return result;
  }

  async findAllByUserId(userId) {
    const result = await knex('orders')
      .select('*')
      .where('userId', userId);
      
    return result;
  }

  async updateOrderStatus(id, orderStatus) {
    await knex('orders')
      .where('id', id)
      .update({
        orderStatus
      });
  }
}

module.exports = new OrdersRepository();
