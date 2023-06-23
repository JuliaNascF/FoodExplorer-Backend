const db = require("../database/database.connection");

class UserRepository {
  async findByEmail(email) {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    return user.rows[0];
  }

  async create({ name, email, password }) {
    const query = {
      text: "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      values: [name, email, password],
    };

    const result = await db.query(query);

    return { id: result.rows[0].id };
  }
}

module.exports = UserRepository;
