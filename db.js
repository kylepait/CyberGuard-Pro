const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '172.18.12.20',
  user: 'root',
  password: 'password',
  database: 'mysql-container',
  connectionLimit: 10, // Adjust based on your needs
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database!');
  }
});

module.exports = db;