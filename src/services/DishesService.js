
const DishesRepository = require('../repositories/DishesRepository');
const aws = require('aws-sdk');



class DishesService {
  constructor() {
    this.dishesRepository = new DishesRepository();
    this.s3 = new aws.S3();
  }

  async create(dishData) {
    const { name } = dishData;
    const existingDish = await this.dishesRepository.findByDishName(name);

    if (existingDish) {
      throw new Error('O prato já existe.');
    }

    try {
      const dishId = await this.dishesRepository.create(dishData);
      return dishId;
    } catch (error) {
      console.error('Erro ao criar o prato:', error);
      throw new Error('Erro ao criar o prato.');
    }
  }

  async update(id, dishData) {
    try {
      await this.dishesRepository.update(id, dishData);
      return 'Prato atualizado com sucesso';
    } catch (error) {
      console.error('Erro ao atualizar o prato:', error);
      throw new Error('Erro ao atualizar o prato.');
    }
  }

  async show(id) {
    try {
      const dish = await this.dishesRepository.show(id);
      return dish;
    } catch (error) {
      console.error('Erro ao buscar o prato:', error);
      throw new Error('Erro ao buscar o prato.');
    }
  }

  async delete(id) {
    try {
      await this.dishesRepository.delete(id);
      return 'Prato excluído com sucesso';
    } catch (error) {
      console.error('Erro ao excluir o prato:', error);
      throw new Error('Erro ao excluir o prato.');
    }
  }

  async index({ name, ingredients }) {
    try {
      const dishes = await this.dishesRepository.index({ name, ingredients });
      return dishes;
    } catch (error) {
      console.error('Erro ao buscar os pratos:', error);
      throw new Error('Erro ao buscar os pratos.');
    }
  }

  async deleteImageFromS3(imageKey) {
    const params = {
      Bucket: 'usuariofood',
      Key: imageKey,
    };
    await this.s3.deleteObject(params).promise();
  }
}

module.exports = new DishesService();
