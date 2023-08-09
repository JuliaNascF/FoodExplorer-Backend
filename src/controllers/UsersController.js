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
  
 
}

module.exports = UsersController;
