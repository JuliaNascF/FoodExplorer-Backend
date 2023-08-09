const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();
const {loginSchema} = require("../schemas/auth.schemas.js");

const sessionsRoutes = Router();

const validateLoginSchema = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  };
  
sessionsRoutes.post("/",validateLoginSchema, sessionsController.create);

module.exports = sessionsRoutes;