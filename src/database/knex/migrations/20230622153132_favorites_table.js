exports.up = function (knex) {
    return knex.schema.createTable('favorites', function (table) {
      table.increments('id').primary();
      table.integer("userId").references("id").inTable("users")
      table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
     
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('favorites');
  };
  
  