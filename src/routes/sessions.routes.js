const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();
const {userSchema} = require("../schemas/auth.schemas.js");

const sessionsRoutes = Router();

const validateLoginSchema = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  };
  
sessionsRoutes.post("/",validateLoginSchema, sessionsController.create);

module.exports = sessionsRoutes;