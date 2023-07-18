const { Router } = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const FavoritesController = require("../controllers/FavoritesController");

const favoritesRouter = Router();
const favoriteController = new FavoritesController() ;


favoritesRouter.post("/:id", ensureAuthenticated, favoriteController.addToFavorites);
favoritesRouter.get("/", ensureAuthenticated, favoriteController.getFavorites);
favoritesRouter.get("/check/:id", ensureAuthenticated, favoriteController.checkFavoriteStatus);
favoritesRouter.delete("/:id", ensureAuthenticated, favoriteController.removeFavorites);


module.exports = favoritesRouter;