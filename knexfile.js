const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'ejvllvtg',
      user: 'ejvllvtg',
      password: 'IufuDDWLzmVMtc0kxXj2OuqsfA_2QQ8z',
      host: 'batyr.db.elephantsql.com',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '__tests__' , 'test.db') 
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
    }
  }
 
};
