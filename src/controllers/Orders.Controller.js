const ordersService = require("../services/OrdersService");

class OrdersController {
  async create(request, response) {
    const { orderStatus, total_amount, payment_method, items } = request.body;
    const userId = request.user.id;
  
    try {
      const orderId = await ordersService.createOrder(
        orderStatus,
        total_amount,
        payment_method,
        userId,
        items 
      );
      return response.status(201).json(orderId);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
  
  async getAllOrders(request, response) {

    try {
      const orders = await ordersService.getAllOrders();
      return response.status(200).json(orders);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async index(request, response) {
    const userId = request.user.id;
    const isAdmin = request.user.isAdmin;

    try {
      const orders = await ordersService.getOrdersByUserId(userId, isAdmin);
      return response.status(200).json(orders);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async update(request, response) {
    const { id, orderStatus } = request.body;

    try {
      await ordersService.updateOrderStatus(id, orderStatus);
      return response.status(201).json();
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}
module.exports =  OrdersController;