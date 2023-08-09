const knexfile = require("../../../knexfile");
const knex = require("knex");
const dotenv=require("dotenv");

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const connection = knex(knexfile[environment]);

module.exports= connection;
