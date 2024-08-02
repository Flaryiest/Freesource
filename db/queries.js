const pool = require("./pool")



async function signUp(username, password) {
    const { rows } = await pool.query("SELECT last_value FROM users_id_seq")
    const currentId = rows[0].last_value
    const user_tasks_table_name = username + String(currentId)
    await pool.query("INSERT INTO users (username, password, user_tasks_table_name) VALUES (($1), ($2), ($3))", [username, password, user_tasks_table_name])
    await pool.query(`
    CREATE TABLE IF NOT EXISTS "${user_tasks_table_name}" (
      id int,
      task VARCHAR(255),
      status VARCHAR(255),
      PRIMARY KEY (id)
    );
  `)
}



module.exports = {signUp}