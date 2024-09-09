import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getTasks() {
  const [rows] = await pool.query("SELECT * FROM task");
  return rows;
}

// make sure to use '?' to prevent SQL injection attacks
export async function getTask(id) {
  const [rows] = await pool.query("SELECT * FROM task WHERE id = ?", [id]);
  return rows[0];
}

export async function createTask(title, content) {
  const [result] = await pool.query(
    "INSERT INTO task (title, contents) VALUES (?, ?)",
    [title, content],
  );
  const id = result.insertId;
  return getTask(id);
}
