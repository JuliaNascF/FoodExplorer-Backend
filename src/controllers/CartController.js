const knex = require("../database/knex");

class CartController {
  async addToCart(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;
    const quantity = req.body.quantity || 1; 

    try {
      const user = await knex('users').where('id', userId).first();
      if (!user) return res.status(404).send("Usuário não encontrado");

      const dish = await knex('dishes').where('id', dishId).first();
      if (!dish) return res.status(404).send("Prato não encontrado");

    
      const cartItem = await knex('orderItem')
        .where('user_id', userId)
        .where('dish_id', dishId)
        .first();

      if (cartItem) {
        
        return res.status(400).send("O prato já está no carrinho do usuário");
        
      } else {
        // Adiciona o prato ao carrinho do usuário
        await knex('orderItem').insert({ user_id: userId, dish_id: dishId, quantity});
      }

      res.status(200).json({ dish });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async checkIfInCart(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;

    try {
     
      const user = await knex('users').where('id', userId).first();
      if (!user) return res.status(404).send("Usuário não encontrado");

      const cartItem = await knex('orderItem')
        .where('user_id', userId)
        .where('dish_id', dishId)
        .first();

      res.status(200).json({ isInCart: !!cartItem });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async decreaseQuantity(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;

    try {
      // Verifica se o usuário existe
      const user = await knex('users').where('id', userId).first();
      if (!user) return res.status(404).send("Usuário não encontrado");

      // Verifica se o item do carrinho existe
      const cartItem = await knex('orderItem')
        .where('user_id', userId)
        .where('dish_id', dishId)
        .first();

      if (!cartItem) return res.status(404).send("Prato não encontrado no carrinho");

      if (cartItem.quantity <= 1) {
        // Remove o item do carrinho se a quantidade for menor ou igual a 1
        await knex('orderItem')
          .where('user_id', userId)
          .where('dish_id', dishId)
          .del();
      } else {
        // Decrementa a quantidade do item no carrinho
        await knex('orderItem')
          .where('user_id', userId)
          .where('dish_id', dishId)
          .decrement('quantity', 1);
      }

      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async removeFromCart(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;

    try {
      // Verifica se o usuário existe
      const user = await knex('users').where('id', userId).first();
      if (!user) return res.status(404).send("Usuário não encontrado");

      // Verifica se o item do carrinho existe
      const cartItem = await knex('orderItem')
        .where('user_id', userId)
        .where('dish_id', dishId)
        .first();

      if (!cartItem) return res.status(404).send("Prato não encontrado no carrinho");

      // Remove o item do carrinho
      await knex('orderItem')
        .where('user_id', userId)
        .where('dish_id', dishId)
        .del();

      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async clearCart(req, res) {
    const userId = req.user.id;

    try {
      const user = await knex('users').where('id', userId).first();
      if (!user) return res.status(404).send("Usuário não encontrado");

      await knex('orderItem').where('user_id', userId).del();

      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getCart(req, res) {
    const userId = req.user.id;

    try {
      // Verifica se o usuário existe
      const user = await knex('users').where('id', userId).first();
      if (!user) return res.status(404).send("Usuário não encontrado");

      // Obtém todos os itens do carrinho do usuário com informações do prato (dish)
      const cartItems = await knex('orderItem')
        .where('user_id', userId)
        .join('dishes', 'orderItem.dish_id', '=', 'dishes.id')
        .select('orderItem.*', 'dishes.*');

      let sum = 0;
      cartItems.forEach((item) => {
        const quantity = item.quantity || 1;
        const price = parseFloat(item.price);
        const totalPrice = quantity * price;
        sum += totalPrice;
      });

      const totalPriceFormatted = sum.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      res.status(200).json({ cartItems, total: `R$ ${totalPriceFormatted}` });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
module.exports= CartController;
