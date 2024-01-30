const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const cors = require('cors')
const bodyParser = require('body-parser');



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

router.post('/Signup', (req, res) => {
    
    const qry = 'INSERT INTO users_table (username, password, organization_id, email) VALUES (?,?,?,?)';
    const values = [
        req.body.username,
        req.body.password,
        req.body.org_id, 
        req.body.email
    ]

    pool.query(qry, values, (err, data) => {
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error'});

        }
        return res.json(data);
    })

});

router.post('/Login', (req, res) => {
    const { email, password } = req.body;
    const qry = 'SELECT * FROM users_table WHERE email = ? AND password = ?';
    const values = [email, password];

    pool.query(qry, values, (err, result) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length > 0) {
            // User found, login successful
            return res.json({ message: 'Login successful' });
        } else {
            // User not found or incorrect credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});


module.exports = router;