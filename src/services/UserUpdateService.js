const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const UserRepository= require("../repositories/UsersRepository")

class UserUpdateService {
  async execute({ id, name, email, password, old_password }) {
    const userRepository = new UserRepository();
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }


    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(
        old_password,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await userRepository.update({ id, name, email, password: user.password });

    return user;
  }
}

module.exports = UserUpdateService;
