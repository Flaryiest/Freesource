require("dotenv").config();
const { Pool } = require("pg");

const connectionString = "postgresql://" + process.env.USER + ":" + process.env.PASSWORD + "@" + process.env.HOST + ":" + process.env.PORT + "/" + process.env.DATABASE 
module.exports = new Pool({
    connectionString,
});