const Joi = require("joi");

const userSchema = Joi.object({
    name: Joi.string().required().error(new Error("O nome é obrigatório")),
    email: Joi.string().email().required().error(new Error("O email é inválido")),
    password: Joi.string().min(6).required().error(new Error("A senha deve ter pelo menos 6 caracteres")),
  });

 const loginSchema = Joi.object({
    email: Joi.string().email().required().error(new Error("O email é inválido")),
    password: Joi.string().min(6).required().error(new Error("A senha deve ter pelo menos 6 caracteres")),
  });

module.exports = userSchema;
module.exports = loginSchema;