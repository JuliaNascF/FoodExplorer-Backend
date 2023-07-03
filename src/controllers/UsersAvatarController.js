const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const multer = require("../configs/multer");
const aws = require('aws-sdk');
require('dotenv').config();

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.key;

    const user = await knex("users").where({ id: user_id }).first();
    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    const oldImage = user.avatar;

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
    user.avatar = avatarFilename;

    await knex("users").update(user).where({ id: user_id });

    return response.status(201).json(user);
  }
}

module.exports = UserAvatarController;
