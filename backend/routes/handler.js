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
    // Adjusted query to join user_badges with badges table to include badge name and image path
    const qry = `
        SELECT ub.user_id, ub.badge_id, b.badge_name, b.image_path
        FROM user_badges ub
        INNER JOIN badges b ON ub.badge_id = b.badge_id
        WHERE ub.user_id = ?`;

    pool.query(qry, [userId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(result);
    });
});

// Endpoint to get badges of all employees in a manager's organization
router.get('/badges/organization/:organizationId', (req, res) => {
    const organizationId = req.params.organizationId;
    
    const qry = `
        SELECT users.user_id, users.first_name, users.last_name, users.email, user_badges.badge_id, badges.badge_name, badges.image_path
        FROM users
        INNER JOIN user_badges ON users.user_id = user_badges.user_id
        INNER JOIN badges ON user_badges.badge_id = badges.badge_id
        WHERE users.organization_id = ? AND users.user_role != 'management';
    `;
    
    pool.query(qry, [organizationId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err });
        }
        
        // Process result to group badges by user
        const employees = result.reduce((acc, curr) => {
            const userIndex = acc.findIndex(user => user.user_id === curr.user_id);
            if (userIndex > -1) {
                acc[userIndex].badges.push({
                    badge_id: curr.badge_id,
                    badge_name: curr.badge_name,
                    image_path: curr.image_path
                });
            } else {
                acc.push({
                    user_id: curr.user_id,
                    first_name: curr.first_name,
                    last_name: curr.last_name,
                    email: curr.email,
                    badges: [{
                        badge_id: curr.badge_id,
                        badge_name: curr.badge_name,
                        image_path: curr.image_path
                    }]
                });
            }
            return acc;
        }, []);
        
        res.json(employees);
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

router.post('/update-password', (req, res) => {
    const { userId, newPassword } = req.body;

    // Directly using the new password without hashing (not recommended for production)
    const qry = 'UPDATE users SET password = ? WHERE user_id = ?';

    pool.query(qry, [newPassword, userId], (err, result) => {
        if (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ success: true, message: 'Password updated successfully' });
    });
});

router.post('/add-badge', (req, res) => {
    const { userId, badgeId } = req.body;

    const insertSql = 'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE badge_id=badge_id';

    pool.query(insertSql, [userId, badgeId], (err, result) => {
        if (err) {
            console.error('Error adding badge to user:', err);
            return res.status(500).json({ error: 'Failed to add badge to user' });
        }
        res.json({ success: true, message: 'Badge added to user successfully' });
    });
});

router.get('/user-training-modules', (req, res) => {
    const userId = req.query.userId;

    const qry = `
        SELECT tm.module_id, tm.module_name, tm.module_link, utm.status
        FROM user_training_modules utm
        JOIN training_modules tm ON utm.module_id = tm.module_id
        WHERE utm.user_id = ?;
    `;

    pool.query(qry, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching training modules:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Separate the modules into assigned and completed
        const assignedModules = result.filter(module => module.status === 'assigned');
        const completedModules = result.filter(module => module.status === 'completed');

        res.json({ assignedModules, completedModules });
    });
});

router.post('/complete-training', (req, res) => {
    const { userId, moduleId } = req.body;

    const updateSql = `
        UPDATE user_training_modules
        SET status = 'completed'
        WHERE user_id = ? AND module_id = ?;
    `;

    pool.query(updateSql, [userId, moduleId], (err, result) => {
        if (err) {
            console.error('Error completing training module:', err);
            return res.status(500).json({ error: 'Failed to complete training module' });
        }
        res.json({ success: true, message: 'Training module completed successfully' });
    });
});

/**  

router.get('/TrainingModule', (req, res) => {
    const userId = req.query.user_id;
    /*Still Working on update/trigger
    const updateQuery = '
        UPDATE user_training_progress
        SET 
        ';

    const qry = 'SELECT * FROM user_training_progress WHERE user_id = ?';
    
    pool.query(qry, [userId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.json(result);
    });
});

*/
module.exports = router;