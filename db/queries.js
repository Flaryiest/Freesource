const pool = require("./pool")



async function signUp(username, password, address, email, type) {
    await pool.query("INSERT INTO users (username, password, location, email, type) VALUES (($1), ($2), ($3), ($4), ($5))", [username, password, address, email, type])
}



module.exports = {signUp}