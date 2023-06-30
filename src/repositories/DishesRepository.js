const knex = require("../database/knex");

class DishesRepository {
    async create(dishData) {
      try {
        const [dishResult] = await knex('dishes')
          .insert(dishData)
          .returning('id');
  
        const dishId = dishResult.id;
  
        const ingredientsArray = Array.isArray(dishData.ingredients)
          ? dishData.ingredients
          : [dishData.ingredients];
  
        await knex('ingredients').insert(
          ingredientsArray.map((ingredient) => ({
            dish_id: dishId,
            name: ingredient,
          }))
        );
  
        return dishId;
      } catch (error) {
        console.error('Erro ao criar o prato:', error);
        throw new Error('Erro ao criar o prato.');
      }
    }
    async findByDishName(name) {
        try {
          const dish = await knex('dishes').where('name', name).first();
          return dish;
        } catch (error) {
          console.error('Erro ao buscar o prato pelo nome:', error);
          throw new Error('Erro ao buscar o prato pelo nome.');
        }
      }
      
  
    async update(id, dishData) {
      try {
        const dish = await knex('dishes').where({ id }).first();
  
        if (!dish) {
          throw new Error('Prato não encontrado.');
        }
  
        const oldImage = dish.image;
  
        if (oldImage) {
          try {
            await deleteImageFromS3(oldImage);
            console.log('Imagem antiga excluída com sucesso');
          } catch (error) {
            console.error('Erro ao excluir a imagem antiga:', error);
          }
        }
  
        const updatedDish = {
          ...dish,
          name: dishData.name ?? dish.name,
          description: dishData.description ?? dish.description,
          category: dishData.category ?? dish.category,
          price: dishData.price ?? dish.price,
          image: dishData.image ?? dish.image,
        };
  
        await knex('dishes').where({ id }).update(updatedDish);
  
        await knex('ingredients').where({ dish_id: id }).delete();
  
        const ingredientsInsert = Array.isArray(dishData.ingredients)
          ? dishData.ingredients.map((ingredient) => ({
              dish_id: id,
              name: ingredient,
            }))
          : [{ dish_id: id, name: dishData.ingredients }];
  
        await knex('ingredients').insert(ingredientsInsert);
  
        return 'Prato atualizado com sucesso';
      } catch (error) {
        console.error('Erro ao atualizar o prato:', error);
        throw new Error('Erro ao atualizar o prato.');
      }
    }
  
    async show(id) {
      try {
        const dish = await knex('dishes').where({ id }).first();
        if (!dish) {
          throw new Error('Prato não encontrado.');
        }
        const ingredients = await knex('ingredients').where({ dish_id: id }).orderBy('name');
  
        return {
          ...dish,
          ingredients,
        };
      } catch (error) {
        console.error('Erro ao buscar o prato:', error);
        throw new Error('Erro ao buscar o prato.');
      }
    }
  
    async delete(id) {
      try {
        const dish = await knex('dishes').where({ id }).first();
  
        if (!dish) {
          throw new Error('Prato não encontrado.');
        }
  
        const imageKey = dish.image;
  
        await knex('dishes').where({ id }).delete();
  
        if (imageKey) {
          await deleteImageFromS3(imageKey);
        }
  
        return 'Prato excluído com sucesso';
      } catch (error) {
        console.error('Erro ao excluir o prato:', error);
        throw new Error('Erro ao excluir o prato.');
      }
    }
  
    async index({ name, ingredients }) {
      try {
        let dishes;
  
        if (ingredients && typeof ingredients === 'string') {
          const filterIngredients = ingredients.split(',').map((ingredient) => ingredient.trim());
  
          dishes = await knex('dishes')
            .select([
              'dishes.id',
              'dishes.name',
              'dishes.description',
              'dishes.category',
              'dishes.price',
              'dishes.image',
            ])
            .whereIn('id', function () {
              this.select('dish_id')
                .from('ingredients')
                .whereIn('name', filterIngredients)
                .groupBy('dish_id')
                .havingRaw('COUNT(*) = ?', filterIngredients.length);
            })
            .where('dishes.name', 'like', `%${name}%`)
            .orderBy('dishes.name');
        } else {
          dishes = await knex('dishes').where('name', 'like', `%${name}%`).orderBy('name');
        }
  
        const dishIds = dishes.map((dish) => dish.id);
  
        const ingredientsQuery = await knex('ingredients')
          .select('dish_id', 'name')
          .whereIn('dish_id', dishIds);
  
        const dishesWithIngredients = dishes.map((dish) => ({
          ...dish,
          ingredients: ingredientsQuery
            .filter((ingredient) => ingredient.dish_id === dish.id)
            .map((ingredient) => ingredient.name),
        }));
  
        return dishesWithIngredients;
      } catch (error) {
        console.error('Erro ao buscar os pratos:', error);
        throw new Error('Erro ao buscar os pratos.');
      }
    }
  }
  
  module.exports = DishesRepository;
  