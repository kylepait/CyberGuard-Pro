const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '172.18.12.20',
  user: 'root',
  password: 'password',
  database: 'mysql-container',
  connectionLimit: 10, // Adjust based on your needs
});

module.exports = pool.promise();