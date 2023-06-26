const knex = require('../database/knex/index'); 
const AppError = require('../utils/AppError');

async function ensureIsAdmin(request, response, next) {
  const user_id = request.user.id;

  try {
    const user = await knex('users').where({ id: user_id }).first();

     if (!user.isAdmin) {
      throw new AppError('Access Denied: Unauthorized User', 401);
    }

    next();
  } catch (error) {
    next(error)
  }
}

module.exports = ensureIsAdmin;
