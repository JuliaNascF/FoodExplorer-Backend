const knex = require("../database/knex");
const AppError = require('../utils/AppError');
const aws = require('aws-sdk');

class DishesController {
    async create(request, response) {
        try {
            const { name, category, description, ingredients, price } = request.body;
            const image = request.file.key;

            const existingDish = await knex('dishes').where('name', name).first();
            if (existingDish) {
                return response.status(400).json({ error: 'O prato já existe.' });
            }
            const [dishResult] = await knex('dishes')
                .insert({
                    name,
                    category,
                    description,
                    ingredients,
                    price,
                    image
                })
                .returning('id');

            const dishId = dishResult.id;

            const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];

            await knex('ingredients').insert(
                ingredientsArray.map((ingredient) => ({
                    dish_id: dishId,
                    name: ingredient
                }))
            );

            return response.sendStatus(201);
        } catch (error) {
            console.error('Erro ao criar o prato:', error);
            return response.status(500).json({ error: 'Erro ao criar o prato.' });
        }
    }

    async update(request, response) {
        const { name, description, category, price, ingredients } = request.body;
        const { id } = request.params;
        const image = request.file.key;
    
        try {
          const dish = await knex('dishes').where({ id }).first();

          const oldImage = dish.image;

          if (oldImage) {
            try {
              const s3 = new aws.S3();
              const params = {
                Bucket: 'usuariofood',
                Key: oldImage
              };
              await s3.deleteObject(params).promise();
              console.log('Imagem antiga excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir a imagem antiga:', error);
            }
          }

          dish.name = name ?? dish.name;
          dish.description = description ?? dish.description;
          dish.category = category ?? dish.category;
          dish.price = price ?? dish.price;
          dish.image = image ?? dish.image
    
          await knex('dishes').where({ id }).update(dish);
    
          await knex('ingredients').where({ dish_id: id }).delete();
    
          const ingredientsInsert = Array.isArray(ingredients) ?
            ingredients.map((ingredient) => ({
              dish_id: id,
              name: ingredient
            })) :
            [{ dish_id: id, name: ingredients }];
    
          await knex('ingredients').insert(ingredientsInsert);
    
          return response.status(200).json('Prato atualizado com sucesso');

        } catch (error) {
          console.error('Erro ao atualizar o prato:', error);
          return response.status(500).json({ error: 'Erro ao atualizar o prato.' });
        }
      }
    
    async show(request, response) {
        const { id } = request.params;
        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.status(201).json({
            ...dish,
            ingredients
        });
    }

    async delete(request, response) {
        const { id } = request.params;
        await knex("dishes").where({ id }).delete();

        return response.status(202).json();
    }

    async index(request, response) {
        // Capturing Query Parameters
        const { title, ingredients } = request.query;

        // Listing Dishes and Ingredients at the same time (innerJoin)
        let dishes;

        if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.title",
                    "dishes.description",
                    "dishes.category",
                    "dishes.price",
                    "dishes.image",
                ])
                .whereLike("dishes.title", `%${title}%`)
                .whereIn("name", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                .groupBy("dishes.id")
                .orderBy("dishes.title")
        } else {
            dishes = await knex("dishes")
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const dishesIngredients = await knex("ingredients")
        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredient
            }
        })

        return response.status(200).json(dishesWithIngredients);
    }

}

module.exports = DishesController;