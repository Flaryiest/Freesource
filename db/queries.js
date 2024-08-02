const pool = require("./pool")



async function signUp(username, password, address, email, type) {
    await pool.query("INSERT INTO users (username, password, location, email, type) VALUES (($1), ($2), ($3), ($4), ($5))", [username, password, address, email, type])
}

async function createPost(user_id, title, price, description, tags) {
    await pool.query("INSERT INTO posts (user_id, title, price, description, tags) VALUES (($1), ($2), ($3), ($4), ($5))", [user_id, title, price, description, tags])
}

module.exports = {signUp, createPost}