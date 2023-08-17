const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();
const { loginSchema } = require("../schemas/auth.schemas.js");

const sessionsRoutes = Router();


sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;