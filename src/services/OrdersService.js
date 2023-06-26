const ordersRepository = require("../repositories/OrdersRepository");

class OrdersService {
  async createOrder(orderStatus, total_amount, payment_method, userId) {
    try {
      const orderId = await ordersRepository.create(orderStatus, total_amount, payment_method, userId);
      return orderId;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getOrdersByUserId(userId, isAdmin) {
    try {
      if (isAdmin) {
        return ordersRepository.findAllByUserId(userId);
      } else {
        return ordersRepository.findAllByUserId(userId);
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async updateOrderStatus(orderId, orderStatus) {
    try {
      await ordersRepository.updateOrderStatus(orderId, orderStatus);
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}

module.exports = new OrdersService();
