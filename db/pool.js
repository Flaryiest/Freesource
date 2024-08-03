require("dotenv").config();
const { Pool } = require("pg");

const connectionString = "postgresql://postgres:whIIruXzYuaouclPRcadhPrBFXmfBaTL@postgres.railway.internal:5432/railway"
module.exports = new Pool({
    connectionString,
});