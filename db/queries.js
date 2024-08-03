const pool = require("./pool")



async function signUp(username, password, address, email, type) {
    await pool.query("INSERT INTO users (username, password, location, email, type) VALUES (($1), ($2), ($3), ($4), ($5))", [username, password, address, email, type])
}

async function createPost(user_id, title, price, description, tags, email, location) {
    await pool.query("INSERT INTO posts (user_id, title, price, description, tags, status, email, location) VALUES (($1), ($2), ($3), ($4), ($5), 'pending', ($6), ($7))", [user_id, title, price, description, tags, email, location])
}

async function getUserPosts(user_id) {
    const {rows} = await pool.query("SELECT * FROM posts WHERE user_id = ($1)", [user_id])
    console.log(rows)
    return rows
}

async function deleteUserPost(postID) {
    await pool.query("DELETE FROM posts WHERE id = ($1)", [postID])
}
async function getAllUserPosts() {
    const {rows} = await pool.query("SELECT * FROM posts")
    return rows
}

async function changeUserTags(user_id, tags) {
    const prepedTags = JSON.stringify(tags)
    .replace('[', '{')
    .replace(']', '}');
    await pool.query("UPDATE users SET tags = ($1) WHERE id = ($2)", [prepedTags, user_id])
}

module.exports = {signUp, createPost, getUserPosts, deleteUserPost, getAllUserPosts, changeUserTags}