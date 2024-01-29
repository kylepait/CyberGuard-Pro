const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');

router.get('/Signup', async (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const qry = 'SELECT u.username, u.password, u.organization_id FROM users_table as u';
        
        connection.query(qry, (err, result) => {
            connection.release();

            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json(result);
        });
    });
});

router.post('/addUser', (req, res) => {
    res.end('NA');
});

module.exports = router;