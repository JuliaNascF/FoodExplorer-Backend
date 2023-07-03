const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/multer');
const UsersController = require("../controllers/UsersController");
const UsersAvatarController= require("../controllers/UsersAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersController = new UsersController();
const userAvatarController = new UsersAvatarController();


const usersRoutes = Router();

usersRoutes.post("/",usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, multer(uploadConfig).single("avatar"), userAvatarController.update);


module.exports = usersRoutes;