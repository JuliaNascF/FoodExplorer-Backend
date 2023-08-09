const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/multer');
const UsersController = require("../controllers/UsersController");
const { userSchema } = require("../schemas/auth.schemas.js");

const usersController = new UsersController();
const usersRoutes = Router();

const validateUserSchema = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
};



usersRoutes.post("/", validateUserSchema, usersController.create);




module.exports = usersRoutes;