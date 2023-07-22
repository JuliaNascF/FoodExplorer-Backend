exports.up = function (knex) {
    return knex.schema.table('orderItem', function (table) {
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table('orderItem', function (table) {
      table.dropColumn('user_id');
    });
  };
  