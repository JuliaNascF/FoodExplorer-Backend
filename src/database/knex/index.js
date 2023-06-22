const knexfile = require("../../../knexfile.js");
const knex = require("knex");

const connection = knex(knexfile.development);

module.exports= connection;
