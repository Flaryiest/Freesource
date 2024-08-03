const pool = require("./pool")



async function signUp(username, password, location, email, type) {
    await pool.query("INSERT INTO users (username, password, lat, long, email, type) VALUES (($1), ($2), ($3), ($4), ($5), ($6))", [username, password, location.lat, location.lng, email, type])
}

async function createPost(user_id, title, price, description, tags, email, lat, long) {
    await pool.query("INSERT INTO posts (user_id, title, price, description, tags, status, email, lat, long) VALUES (($1), ($2), ($3), ($4), ($5), 'pending', ($6), ($7))", [user_id, title, price, description, tags, email, lat, long])
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

async function acceptPost(userID, postID) {
    await pool.query("UPDATE posts SET seller_id = ($1), status = 'accepted' WHERE id = ($2) ", [userID, postID])
}

async function getAcceptedPosts(userID) {
    const {rows} = await pool.query("SELECT * FROM posts WHERE seller_id = ($1)", [userID])
    return rows
}

async function completePost(userID, postID) {
    await pool.query("UPDATE posts SET seller_id = null, status = 'completed' WHERE id = ($1)", [postID])
}

module.exports = {signUp, createPost, getUserPosts, deleteUserPost, getAllUserPosts, changeUserTags, acceptPost, getAcceptedPosts, completePost}