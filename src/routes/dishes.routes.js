const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/multer');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const DishesController = require("../controllers/DishesController")

const dishesController = new DishesController();

const dishesRoutes = Router();


dishesRoutes.use(ensureAuthenticated);


dishesRoutes.post("/", multer(uploadConfig).single("file"), (req, res, next) => {
    console.log(req.file); 
    next();
  }, dishesController.create);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.put("/:id", dishesController.update);

module.exports = dishesRoutes;