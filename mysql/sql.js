import sql from "mysql2/promise";

const pool = sql.createPool({
  host: "localhost",
  user: "root",
  password: "", //Your password
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database!");

    const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS myDB;";
    await connection.query(createDatabaseQuery);

    const useDatabaseQuery = "USE myDB;";
    await connection.query(useDatabaseQuery);

    const createUserTableQuery = `CREATE TABLE IF NOT EXISTS users (
      user_id INT PRIMARY KEY AUTO_INCREMENT,
      user_email VARCHAR(255) NOT NULL UNIQUE,
      user_password VARCHAR(255) NOT NULL
    );`;

    await connection.query(createUserTableQuery);

    const createHistoryTableQuery = `CREATE TABLE IF NOT EXISTS ip_history (
      history_id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      ip VARCHAR(255) UNIQUE
    );`;

    await connection.query(createHistoryTableQuery);

    connection.release();
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}

async function seedUsers() {
  try {
    const connection = await pool.getConnection();
    const useDatabaseQuery = "USE myDB;";
    await connection.query(useDatabaseQuery);

    const insertQuery = `INSERT INTO users (user_email, user_password) VALUES (?, ?);`;
    const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE user_email = ?;`;
    const users = [
      {
        user_email: "khaim@gmail.com",
        user_password: "khaim123",
      },
      {
        user_email: "michael@gmail.com",
        user_password: "michael123",
      },
    ];

    for (const user of users) {
      const { user_email, user_password } = user;
      const [rows] = await connection.query(checkUserQuery, [user_email]);
      if (rows[0].count === 0) {
        await connection.query(insertQuery, [user_email, user_password]);
      } else {
        console.log(`User with email ${user_email} already exists.`);
      }
    }

    console.log("User data seeded successfully!");
    connection.release();
  } catch (e) {
    console.error(e);
  }
}

checkConnection().then(() => seedUsers());

export default pool;
