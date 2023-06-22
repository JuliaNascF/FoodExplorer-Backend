exports.up = function (knex) {
    return knex.schema.createTable('dishes', function (table) {
      table.increments('id').primary();
      table.text('name');
      table.text('category');
      table.text('description');
      table.text('ingredients');
      table.text('price');
      table.varchar('image');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('dishes');
  };
  
  