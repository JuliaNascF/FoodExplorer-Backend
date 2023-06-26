const db = require("../database/database.connection");

class OrdersRepository {
  async create(orderStatus, total_amount, payment_method, userId) {
    const query = 'INSERT INTO orders (orderStatus, total_amount, payment_method, userId) VALUES ($1, $2, $3, $4) RETURNING id';
    const values = [orderStatus, total_amount, payment_method, userId];
    const result = await db.query(query, values);
    return result.rows[0].id;
  }

  async findAllByUserId(userId) {
    const query = 'SELECT * FROM orders WHERE userId = $1';
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  }

  async updateOrderStatus(id, orderStatus) {
    const query = 'UPDATE orders SET orderStatus = $1 WHERE id = $2';
    const values = [orderStatus, id];
    await db.query(query, values);
  }
}

module.exports = new OrdersRepository();
