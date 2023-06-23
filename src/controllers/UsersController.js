const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const UserRepository = require("../repositories/UsersRepository");

const db = require("../database/database.connection");
const UserCreateService = require("../services/UserCreationService");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);

    await userCreateService.execute({ name, email, password });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await db.query("SELECT * FROM users WHERE id = $1", [user_id]);

    if (!user.rows[0]) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await db.query(
      "SELECT * FROM users WHERE email = $1 AND id != $2",
      [email, user_id]
    );

    if (userWithUpdatedEmail.rows[0]) {
      throw new AppError("Este e-mail já está em uso");
    }

    user.name = name ?? user.rows[0].name;
    user.email = email ?? user.rows[0].email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(
        old_password,
        user.rows[0].password
      );

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await db.query(
      `UPDATE users SET
        name = $1,
        email = $2,
        password = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4`,
      [user.name, user.email, user.password, user_id]
    );

    return response.json();
  }
}

module.exports = UsersController;
