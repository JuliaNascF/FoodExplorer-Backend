const knex = require('../database/knex/index'); 
const AppError = require('../utils/AppError');

async function ensureIsAdmin(request, response, next) {
  // Capturing ID Parameters
  const user_id = request.user.id;

  try {
    // Getting the user data through the informed ID
    const user = await knex('users').where({ id: user_id }).first();

    // Verification if user is Admin
    if (!user.isAdmin) {
      throw new AppError('Access Denied: Unauthorized User', 401);
    }

    next();
  } catch (error) {
    return response.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = ensureIsAdmin;
