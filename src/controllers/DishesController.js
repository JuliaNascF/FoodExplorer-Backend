const dishesService = require('../services/DishesService.js');

class DishesController {
  async create(request, response) {
    try {
      const { name, category, description, ingredients, price } = request.body;
      const image =  request.file.location

      const dishData = {
        name,
        category,
        description,
        ingredients,
        price,
        image
      };

      await dishesService.create(dishData);
   

      return response.sendStatus(201);
    } catch (error) {
      console.error('Erro ao criar o prato:', error);
      return response.status(500).json({ error: 'Erro ao criar o prato.' });
    }
  }

  async update(request, response) {
    const { name, description, category, price, ingredients } = request.body;
    const { id } = request.params;
    const image = request.file ? request.file.location : undefined;

    try {
      const dishData = {
        name,
        description,
        category,
        price,
        ingredients,
        image
      };

      await dishesService.update(id, dishData);

      return response.status(200).json('Prato atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar o prato:', error);
      return response.status(500).json({ error: 'Erro ao atualizar o prato.' });
    }
  }

  async show(request, response) {
    const { id } = request.params;

    try {
      const dish = await dishesService.show(id);

      return response.status(201).json(dish);
    } catch (error) {
      console.error('Erro ao buscar o prato:', error);
      return response.status(500).json({ error: 'Erro ao buscar o prato.' });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      await dishesService.delete(id);

      return response.status(202).json();
    } catch (error) {
      console.error('Erro ao excluir o prato:', error);
      return response.status(500).json({ error: 'Erro ao excluir o prato.' });
    }
  }

  async index(request, response) {
    try {
      const dishes = await dishesService.index();
      return response.status(200).json(dishes);
    } catch (error) {
      console.error('Erro ao buscar os pratos:', error);
      return response.status(500).json({ error: 'Erro ao buscar os pratos.' });
    }
  }
  
}

module.exports = DishesController;
