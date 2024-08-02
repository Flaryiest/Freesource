require("dotenv").config();
const { Pool } = require("pg");

const connectionString = ""
module.exports = new Pool({
    connectionString,
});