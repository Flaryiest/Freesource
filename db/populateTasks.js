require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username VARCHAR (255), password VARCHAR (255), type VARCHAR (255), email VARCHAR(255), location VARCHAR(255), tags text ARRAY);
CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, user_id INTEGER, title VARCHAR (255), price VARCHAR (255), description VARCHAR(255), tags text ARRAY, status VARCHAR(255), created_timestamp timestamp not null
    default current_timestamp);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://" + process.env.USER + ":" + process.env.PASSWORD + "@" + process.env.HOST + ":" + process.env.PORT + "/" + process.env.DATABASE 
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();