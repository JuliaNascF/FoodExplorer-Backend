const { Router } = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const CartController = require("../controllers/CartController");

const cartRouter = Router();
const cartController = new CartController() ;


cartRouter.post("/:id", ensureAuthenticated,  cartController.addToCart);
cartRouter.get('/check/:id', ensureAuthenticated, cartController.checkIfInCart)
cartRouter.post("/decrease/:id", ensureAuthenticated, cartController.decreaseQuantity);
cartRouter.get("/", ensureAuthenticated, cartController.getCart);
cartRouter.delete('/:id',ensureAuthenticated, cartController.removeFromCart);
cartRouter.delete('/', ensureAuthenticated, cartController.clearCart);


module.exports=cartRouter;