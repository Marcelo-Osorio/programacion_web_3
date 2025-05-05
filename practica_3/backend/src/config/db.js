const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'marcelo',
  password: 'root',
  database: 'electrodomesticos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;