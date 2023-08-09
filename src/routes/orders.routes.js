const { Router } = require('express');
const OrdersController = require("../controllers/Orders.Controller")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureIsAdmin = require("../middlewares/ensureIsAdmin");

const ordersController = new OrdersController();

const ordersRoutes = Router();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/", ordersController.create);
ordersRoutes.get("/", ordersController.index);
ordersRoutes.get("/all", ensureIsAdmin, ordersController.getAllOrders);
ordersRoutes.put("/", ensureIsAdmin, ordersController.update);


module.exports = ordersRoutes;