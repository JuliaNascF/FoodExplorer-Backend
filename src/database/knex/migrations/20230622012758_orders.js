exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('id').inTable('users');
      table.timestamp('date').defaultTo(knex.fn.now());
      table.text('total_amount');
      table.text('payment_method');
      table.text('orderStatus');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('orders');
  };
  