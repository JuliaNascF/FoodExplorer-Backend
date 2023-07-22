const knex = require("../database/knex");

class FavoriteController {
  async getFavorites(req, res) {
    const userId = req.user.id;

    try {
      const favorites = await knex('favorites')
        .join('dishes', 'favorites.dish_id', 'dishes.id')
        .where('favorites.userId', userId)
        .select('dishes.*');

      res.json({ favorites });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async addToFavorites(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;
    
    try {
      const existingFavorite = await knex('favorites')
        .where({ userId, dish_id: dishId })
        .first();

      if (existingFavorite) {
        return res.status(409).send("Esse prato já está nos favoritos!");
      }

      // Adiciona o prato aos favoritos do usuário
      await knex('favorites').insert({ userId, dish_id: dishId });

      res.status(200).send("Prato adicionado aos favoritos com sucesso!");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async removeFavorites(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;

    try {
      const existingFavorite = await knex('favorites')
        .where({ userId, dish_id: dishId })
        .first();

      if (!existingFavorite) {
        return res.status(404).send("Prato não encontrado nos favoritos!");
      }

      // Remove o prato dos favoritos do usuário
      await knex('favorites')
        .where({ userId, dish_id: dishId })
        .del();

      res.status(200).send("Prato removido dos favoritos com sucesso!");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async checkFavoriteStatus(req, res) {
    const userId = req.user.id;
    const dishId = req.params.id;

    try {
      const existingFavorite = await knex('favorites')
        .where({ userId, dish_id: dishId })
        .first();

      if (existingFavorite) {
        res.status(200).json({ isFavorite: true });
      } else {
        res.status(200).json({ isFavorite: false });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}


module.exports = FavoriteController;
