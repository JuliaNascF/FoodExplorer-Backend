
const UserRepository = require("../repositories/UsersRepository");
const UserUpdateService = require("../services/UserUpdateService");

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

    const userUpdateService = new UserUpdateService();

    await userUpdateService.execute({ id: user_id, name, email, password, old_password });

    return response.json();
  }
}

module.exports = UsersController;
