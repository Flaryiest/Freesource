require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username VARCHAR (255), password VARCHAR (255), type VARCHAR (255), email VARCHAR(255), lat VARCHAR (255), long VARCHAR (255), tags text ARRAY);
CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, user_id INTEGER, title VARCHAR (255), price VARCHAR (255), description VARCHAR(255), tags text ARRAY, status VARCHAR(255), lat VARCHAR (255), long VARCHAR (255), email VARCHAR(255), seller_id INTEGER, created_timestamp timestamp not null
    default current_timestamp);
INSERT INTO posts (user_id, title, price, description, tags, status, lat, long, email, seller_id, created_timestamp) VALUES 
(1, 'Snow Shoveling Service', 20, 'Offering snow shoveling services during winter', ARRAY['Gardening', 'Winter services'], 'pending', '51.0851', '-114.1211', 'ericmzuo1@gmail.com', NULL, '2024-08-03 10:15:00'),
(2, 'Leaf Raking', 10, 'Help with raking leaves during fall', ARRAY['Gardening', 'Garden maintenance'], 'pending', '51.0467', '-114.0752', 'janedoe@example.com', NULL, '2024-08-03 11:00:00'),
(3, 'Tree Trimming', 30, 'Professional tree trimming services', ARRAY['Gardening', 'Tree services'], 'pending', '51.0967', '-114.1100', 'johnsmith@example.com', NULL, '2024-08-03 12:30:00'),
(4, 'Gutter Cleaning', 25, 'Cleaning out gutters to prevent clogs and water damage', ARRAY['Home maintenance', 'Cleaning'], 'pending', '50.9936', '-113.9727', 'jameswilson@example.com', NULL, '2024-08-03 13:45:00'),
(5, 'Window Washing', 18, 'Window washing service for both ground and second floors', ARRAY['Home maintenance', 'Cleaning'], 'pending', '51.0823', '-114.1245', 'lucysmith@example.com', NULL, '2024-08-03 14:20:00'),
(6, 'Garden Weeding', 12, 'Weeding and garden bed maintenance', ARRAY['Gardening', 'Garden maintenance'], 'pending', '51.0463', '-114.0850', 'michaelbrown@example.com', NULL, '2024-08-03 15:10:00'),
(7, 'Hedge Trimming', 22, 'Trimming hedges and shrubs for a neat appearance', ARRAY['Gardening', 'Garden design'], 'pending', '51.0834', '-114.1203', 'sandrataylor@example.com', NULL, '2024-08-03 16:05:00'),
(8, 'Lawn Aeration', 35, 'Lawn aeration service to promote healthy grass growth', ARRAY['Gardening', 'Lawn care'], 'pending', '51.0569', '-114.1377', 'brianlee@example.com', NULL, '2024-08-03 16:50:00'),
(9, 'Fence Repair', 50, 'Repairing and painting fences', ARRAY['Home maintenance', 'Repairs'], 'pending', '51.0820', '-114.1428', 'kimberlyjones@example.com', NULL, '2024-08-03 17:30:00'),
(10, 'Garage Organization', 40, 'Organizing garage spaces and disposing of unwanted items', ARRAY['Home maintenance', 'Organizing'], 'pending', '50.9981', '-113.9720', 'davidclark@example.com', NULL, '2024-08-03 18:15:00'),
(11, 'Patio Cleaning', 15, 'Cleaning patios and outdoor spaces', ARRAY['Home maintenance', 'Cleaning'], 'pending', '51.0753', '-114.1262', 'emilydavis@example.com', NULL, '2024-08-03 18:55:00'),
(12, 'Deck Staining', 45, 'Staining and sealing decks', ARRAY['Home maintenance', 'Painting'], 'pending', '51.0532', '-114.1465', 'chrisrobinson@example.com', NULL, '2024-08-03 19:35:00'),
(13, 'Outdoor Furniture Assembly', 20, 'Assembling outdoor furniture and structures', ARRAY['Home maintenance', 'Assembly'], 'pending', '51.0917', '-114.1389', 'amandamartin@example.com', NULL, '2024-08-03 20:20:00'),
(14, 'Holiday Light Installation', 30, 'Installing holiday lights and decorations', ARRAY['Seasonal', 'Decorating'], 'pending', '51.0530', '-114.0785', 'joshjackson@example.com', NULL, '2024-08-03 21:00:00'),
(15, 'Power Washing', 35, 'Power washing driveways, walkways, and siding', ARRAY['Home maintenance', 'Cleaning'], 'pending', '51.0790', '-114.1348', 'stephenking@example.com', NULL, '2024-08-03 21:45:00'),
(16, 'Mailbox Installation', 15, 'Installing and replacing mailboxes', ARRAY['Home maintenance', 'Installation'], 'pending', '51.0765', '-114.1164', 'patriciaturner@example.com', NULL, '2024-08-03 22:30:00'),
(17, 'Landscaping Design', 50, 'Designing landscape layouts and planting plans', ARRAY['Gardening', 'Landscape design'], 'pending', '51.0862', '-114.1401', 'karenscott@example.com', NULL, '2024-08-03 23:15:00'),
(18, 'Sprinkler System Installation', 100, 'Installing sprinkler systems for lawns and gardens', ARRAY['Gardening', 'Irrigation'], 'pending', '50.9944', '-113.9825', 'racheladams@example.com', NULL, '2024-08-04 00:00:00'),
(19, 'Compost Bin Setup', 25, 'Setting up compost bins for organic waste', ARRAY['Gardening', 'Sustainability'], 'pending', '51.0894', '-114.1469', 'josephjohnson@example.com', NULL, '2024-08-04 00:45:00'),
(20, 'Raised Bed Construction', 30, 'Building raised garden beds for vegetables and flowers', ARRAY['Gardening', 'Garden design'], 'pending', '50.9975', '-113.9716', 'nicolasmiller@example.com', NULL, '2024-08-04 01:30:00'),
(21, 'Greenhouse Assembly', 200, 'Assembling and setting up greenhouses', ARRAY['Gardening', 'Garden design'], 'pending', '51.0895', '-114.1490', 'megangonzalez@example.com', NULL, '2024-08-04 02:15:00'),
(22, 'Mulch Installation', 40, 'Spreading mulch around garden beds and trees', ARRAY['Gardening', 'Garden maintenance'], 'pending', '50.9942', '-113.9724', 'peterallen@example.com', NULL, '2024-08-04 03:00:00'),
(23, 'Pest Control', 60, 'Outdoor pest control for garden pests and insects', ARRAY['Gardening', 'Pest control'], 'pending', '51.0857', '-114.1482', 'larrycampbell@example.com', NULL, '2024-08-04 03:45:00'),
(24, 'Bird Feeder Installation', 15, 'Installing bird feeders and bird baths', ARRAY['Gardening', 'Wildlife'], 'pending', '50.9992', '-114.1556', 'cherylreyes@example.com', NULL, '2024-08-04 04:30:00'),
(25, 'Lawn Mower Repair', 50, 'Repair and maintenance of lawn mowers and garden tools', ARRAY['Gardening', 'Equipment repair'], 'pending', '51.0915', '-114.1390', 'kennethlewis@example.com', NULL, '2024-08-04 05:15:00');

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