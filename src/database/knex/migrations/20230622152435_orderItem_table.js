exports.up = function (knex) {
    return knex.schema.createTable('orderItem', function (table) {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
      table.integer('quantity').notNullable().defaultTo(1);
      table.timestamp('date').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('orderItem');
  };
  
  