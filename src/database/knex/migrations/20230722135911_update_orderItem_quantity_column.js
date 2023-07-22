exports.up = function(knex) {
    return knex.schema.alterTable('orderItem', function(table) {
      table.renameColumn('quantify', 'quantity');
    
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('orderItem', function(table) {
      table.renameColumn('quantity', 'quantify');
      table.dropColumn('quantity');
    });
  };
  