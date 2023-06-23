const pg = require("pg");
const dotenv=require("dotenv");

dotenv.config();

const { Pool } = pg;

const configDatabase = {
    connectionString:process.env.DATABASE_URL
}

 const db = new Pool(configDatabase);

 module.exports =db;