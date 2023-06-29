const knex = require("../database/knex");
const AppError = require('../utils/AppError');


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

            console.log('dishId:', dishId);



            const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];

            await knex('ingredients').insert(
                ingredientsArray.map((ingredient) => ({
                    dish_id: dishId,
                    name: ingredient
                }))
            );



            // Retornar uma resposta de status 201 (criado) sem dados no corpo
            return response.sendStatus(201);
        } catch (error) {
            console.error('Erro ao criar o prato:', error);
            return response.status(500).json({ error: 'Erro ao criar o prato.' });
        }
    }



    async update(request, response) {
        const { name, description, category, price, ingredients, image } = request.body;
        const { id } = request.params;
        const imageFileName = request.file.filename;


        const diskStorage = new DiskStorage();

        const dish = await knex("dishes").where({ id }).first();

        if (dish.image) {
            await diskStorage.deleteFile(dish.image);
        }

        const filename = await diskStorage.saveFile(imageFileName);


        dish.image = image ?? filename;
        dish.title = title ?? dish.title;
        dish.description = description ?? dish.description;
        dish.category = category ?? dish.category;
        dish.price = price ?? dish.price;


        await knex("dishes").where({ id }).update(dish);


        const hasOnlyOneIngredient = typeof (ingredients) === "string";

        let ingredientsInsert

        if (hasOnlyOneIngredient) {
            ingredientsInsert = {
                name: ingredients,
                dish_id: dish.id,
            }

        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map(ingredient => {
                return {
                    dish_id: dish.id,
                    name: ingredient
                }
            });
        }

        await knex("ingredients").where({ dish_id: id }).delete()
        await knex("ingredients").where({ dish_id: id }).insert(ingredientsInsert)

        return response.status(201).json('Prato atualizado com sucesso')
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