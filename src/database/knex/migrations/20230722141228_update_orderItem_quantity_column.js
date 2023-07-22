exports.up = function(knex) {
    return knex.schema.alterTable('orderItem', function(table) {
      table.integer('quantity').notNullable().defaultTo(1).alter();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('orderItem', function(table) {
      table.integer('quantity').alter();
    });
  };
  