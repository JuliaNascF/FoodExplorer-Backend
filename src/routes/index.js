const { Router } = require('express');

const usersRouter = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const ordersRoutes = require("./orders.routes")
const dishesRoutes = require("./dishes.routes")


const routes = Router();


routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/dishes", dishesRoutes);


module.exports = routes;