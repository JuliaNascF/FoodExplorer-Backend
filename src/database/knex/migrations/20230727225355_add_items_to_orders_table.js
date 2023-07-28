exports.up = function(knex) {
    return knex.schema.table('orders', function(table) {
      table.text('items'); // Adicionando a coluna 'items' do tipo texto
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('orders', function(table) {
      table.dropColumn('items'); // Removendo a coluna 'items' caso seja necessário desfazer a migração
    });
  };
  