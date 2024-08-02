require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task VARCHAR ( 255 )
);

INSERT INTO usernames (username) 
VALUES
('Visit a new city'), ('Learn to cook a new recipe'), ('Go on a weekend road trip'), ('Read 12 books'), ('Try a new restaurant'), ('Attend a local festival'), ('Take a yoga class'), ('Learn a new hobby'), ('Go hiking'), ('Visit a museum'), ('Start a journal'), ('Visit a botanical garden'), ('Go camping'), ('Take a dance class'), ('Try a new sport'), ('Visit a national park'), ('Volunteer for a cause'), ('Attend a live concert');
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