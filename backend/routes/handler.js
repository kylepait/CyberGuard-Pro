const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const cors = require('cors')
const bodyParser = require('body-parser');

// Use cors middleware
router.use(cors());



router.get('/Signup', async (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const qry = 'SELECT u.username, u.password, u.organization_id, u.first_name, u.last_name FROM users as u';
        
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
    
    const qry = 'INSERT INTO users (username, password, organization_id, email, first_name, last_name, user_role) VALUES (?,?,?,?,?,?,?)';
    const values = [
        req.body.username,
        req.body.password,
        req.body.org_id, 
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.user_role
    ]

    pool.query(qry, values, (err, data) => {
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error'});

        }
        return res.json(data);
    })

});

router.get('/badges', (req, res) => {
    const userId = req.query.user_id;
    const qry = 'SELECT * FROM user_badges WHERE user_id = ?';
    
    pool.query(qry, [userId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.json(result);
    });
});

router.post('/Login', (req, res) => {
    const { email, password } = req.body;
    const qry = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const values = [email, password];

    pool.query(qry, values, (err, result) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length > 0) {
            const user = result[0];

            // User found, login successful
            return res.json({ 
                message: 'Login successful',
                user: user, // Include the entire user object in the response
            });
        } else {
            // User not found or incorrect credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

router.get('/TrainingModule', (req, res) => {
    const userId = req.query.user_id;
    /*Still Working on update/trigger
    const updateQuery = '
        UPDATE user_training_progress
        SET 
        ';
    */
    const qry = 'SELECT * FROM user_training_progress WHERE user_id = ?';
    
    pool.query(qry, [userId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.json(result);
    });
});

module.exports = router;