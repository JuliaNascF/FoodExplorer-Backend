const knex = require("../database/knex");
const aws = require('aws-sdk');

class DishesRepository {
  constructor() {
    this.s3 = new aws.S3();
  }
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
            await this.deleteImageFromS3(oldImage);
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
          await this.deleteImageFromS3(imageKey);
        }
  
        return 'Prato excluído com sucesso';
      } catch (error) {
        console.error('Erro ao excluir o prato:', error);
        throw new Error('Erro ao excluir o prato.');
      }
    }
  
    async deleteImageFromS3(imageKey) {
      const params = {
        Bucket: 'usuariofood',
        Key: imageKey,
      };
      await this.s3.deleteObject(params).promise();
    }

    async index() {
      try {
        const dishes = await knex('dishes').orderBy('name');
        return dishes;
      } catch (error) {
        console.error('Erro ao buscar os pratos:', error);
        throw new Error('Erro ao buscar os pratos.');
      }
    }
    
  }
  
  module.exports = DishesRepository;
  