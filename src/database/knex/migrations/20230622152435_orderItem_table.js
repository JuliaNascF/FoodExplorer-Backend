exports.up = function (knex) {
    return knex.schema.createTable('orderItem', function (table) {
      table.increments('id').primary();
      table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
      table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
      table.text('quantify');
      table.timestamp('date').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('orderItem');
  };
  
  