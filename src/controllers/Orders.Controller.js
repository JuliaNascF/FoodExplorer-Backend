const knex = require('../database/knex/index');
const db= require("../database/database.connection")

class OrdersController {
    async create(request, response) {
        // Capturing Body Parameters and ID Parameters
        const { orderStatus, total_amount, payment_method } = request.body;
        const userId = request.user.id;
    
        try {
          // Inserting Order info into the database
          const query = 'INSERT INTO orders (orderStatus, total_amount, payment_method, userId) VALUES ($1, $2, $3, $4) RETURNING id';
          const values = [orderStatus, total_amount, payment_method, userId];
          const result = await db.query(query, values);
          const order_id = result.rows[0].id;
    
          return response.status(201).json(order_id);
        } catch (error) {
          return response.status(500).json({ error: 'Internal server error' });
        }
      }
      async index(request, response) {
        // Capturing ID Parameters
        const user_id = request.user.id;
    
        try {
          // Getting the user data through the informed ID
          const queryUser = 'SELECT * FROM users WHERE id = $1';
          const userResult = await db.query(queryUser, [user_id]);
          const user = userResult.rows[0];
    
          // Listing Orders for User
          let queryOrders = 'SELECT * FROM orders WHERE userId = $1';
          const values = [user_id];
    
          if (!user.isAdmin) {
            queryOrders += ' AND userId = $1';
          }
    
          const ordersResult = await db.query(queryOrders, values);
          const orders = ordersResult.rows;
    
          return response.status(200).json(orders);
        } catch (error) {
          return response.status(500).json({ error: 'Internal server error' });
        }
      }
    
      async update(request, response) {
        // Capturing Body Parameters
        const { id, orderStatus } = request.body;
    
        try {
          // Updating Order info through the informed ID
          const query = 'UPDATE orders SET orderStatus = $1 WHERE id = $2';
          const values = [orderStatus, id];
          await db.query(query, values);
    
          return response.status(201).json();
        } catch (error) {
          return response.status(500).json({ error: 'Internal server error' });
        }
      }
}

module.exports = OrdersController;
