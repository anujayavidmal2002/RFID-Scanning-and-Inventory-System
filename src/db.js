import pg from "pg"
import env from "dotenv"

env.config();

const { Client } = require("pg");

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT, 10),
  ssl: {
    rejectUnauthorized: false, // Railway requires this
  },
});

console.log({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: typeof process.env.PG_PORT,
});

//db.connect();

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));


client.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

export const query = (text, params) => client.query(text, params);