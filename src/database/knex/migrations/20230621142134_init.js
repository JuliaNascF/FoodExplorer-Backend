
exports.up = function(knex) {
    return knex.schema.createTable("users", function(table) {
      table.increments("id").primary();
      table.text("name").notNullable();
      table.text("email").notNullable().unique();
      table.text("password").notNullable();
      table.boolean("isAdmin").defaultTo(false);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("users");
  };
  