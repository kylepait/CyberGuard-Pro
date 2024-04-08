const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const cors = require('cors')
const bodyParser = require('body-parser');
const util = require('util');


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
router.get('/badges/organization/:organizationId', async (req, res) => {
    const organizationId = req.params.organizationId;
    
    const qry = `
        SELECT users.user_id, users.first_name, users.last_name, users.email, user_badges.badge_id, badges.badge_name, badges.image_path, user_badges.earned_date
        FROM users
        INNER JOIN user_badges ON users.user_id = user_badges.user_id
        INNER JOIN badges ON user_badges.badge_id = badges.badge_id
        WHERE users.organization_id = ? AND users.user_role != 'management';
    `;
    
    try {
        const [result] = await pool.promise().query(qry, [organizationId]);
        
        // Process result to group badges by user and include earned_date
        const employees = result.reduce((acc, curr) => {
            const userIndex = acc.findIndex(user => user.user_id === curr.user_id);
            if (userIndex > -1) {
                acc[userIndex].badges.push({
                    badge_id: curr.badge_id,
                    badge_name: curr.badge_name,
                    image_path: curr.image_path,
                    earned_date: curr.earned_date // Include earned_date in each badge object
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
                        image_path: curr.image_path,
                        earned_date: curr.earned_date // Include earned_date
                    }]
                });
            }
            return acc;
        }, []);
        
        res.json(employees);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
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
    const earnedDate = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    const insertSql = 'INSERT INTO user_badges (user_id, badge_id, earned_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE badge_id=badge_id, earned_date=VALUES(earned_date)';

    pool.query(insertSql, [userId, badgeId, earnedDate], (err, result) => {
        if (err) {
            console.error('Error adding badge to user:', err);
            return res.status(500).json({ error: 'Failed to add badge to user' });
        }
        res.json({ success: true, message: 'Badge added to user successfully' });
    });

    // Update the user's score
    const updateScoreSql = 'UPDATE users SET score = score + 1 WHERE user_id = ?';
        pool.query(updateScoreSql, [userId], (err, result) => {
            if (err) {
                console.error('Error updating user score:', err);
                return res.status(500).json({ error: 'Failed to update user score' });
            }

            res.json({ success: true, message: 'Badge added to user successfully' });
    });

});

router.get('/user-training-modules', (req, res) => {
    const userId = req.query.userId;

    const qry = `
        SELECT tm.module_id, tm.module_name, tm.module_link, utm.status, tm.module_format
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


router.post('/complete-training', async (req, res) => {
    const { userId, moduleId } = req.body;
    const endTime = new Date();

    // Start a transaction
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        connection.beginTransaction(err => {
            if (err) throw err;

            // Update the training module status to completed
            const updateTrainingSql = `
                UPDATE user_training_modules
                SET status = 'completed', end_time = ?
                WHERE user_id = ? AND module_id = ?;
            `;

            connection.query(updateTrainingSql, [endTime, userId, moduleId], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        throw err;
                    });
                }

                // Check if there's a badge associated with this module
                const checkBadgeSql = `
                    SELECT badge_id FROM module_badges WHERE module_id = ?;
                `;
                connection.query(checkBadgeSql, [moduleId], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }

                    if (results.length > 0) {
                        const badgeId = results[0].badge_id;

                        // Award the badge
                        const awardBadgeSql = `
                            INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)
                            ON DUPLICATE KEY UPDATE badge_id = badge_id; -- Prevents duplicate badge assignments
                        `;
                        connection.query(awardBadgeSql, [userId, badgeId], (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    throw err;
                                });
                            }

                            // Commit the transaction
                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        throw err;
                                    });
                                }
                                console.log('Training completed and badge awarded successfully');
                                res.json({ success: true, message: 'Training completed and badge awarded successfully' });
                            });
                        });
                    } else {
                        // Commit the transaction even if no badge is awarded
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    throw err;
                                });
                            }
                            console.log('Training completed successfully');
                            res.json({ success: true, message: 'Training completed successfully' });
                        });
                    }
                });
            });
        });
    });
});


router.get('/training-assignments/:organizationId', (req, res) => {
    const organizationId = req.params.organizationId;
    const qry = `
        SELECT utm.user_id, u.username, u.first_name, u.last_name, utm.module_id, tm.module_name, utm.status
        FROM user_training_modules utm
        JOIN users u ON utm.user_id = u.user_id
        JOIN training_modules tm ON utm.module_id = tm.module_id
        WHERE u.organization_id = ? AND u.user_role != 'management';
    `;
    pool.query(qry, [organizationId], (err, results) => {
        if (err) {
            console.error('Error fetching training assignments:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

router.get('/all-trainings', (req, res) => {
    const qry = 'SELECT module_id, module_name FROM training_modules';
    pool.query(qry, (err, results) => {
        if (err) {
            console.error('Error fetching training modules:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

router.post('/enroll-training', (req, res) => {
    const { userId, moduleId } = req.body;
    const qry = 'INSERT INTO user_training_modules (user_id, module_id, status) VALUES (?, ?, "assigned")';
    pool.query(qry, [userId, moduleId], (err, results) => {
        if (err) {
            console.error('Error enrolling in training module:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Enrolled in training module successfully' });
    });
});

router.post('/enroll-employee-training', (req, res) => {
    const { employeeUserId, moduleId } = req.body;

    const qry = 'INSERT INTO user_training_modules (user_id, module_id, status) VALUES (?, ?, "assigned") ON DUPLICATE KEY UPDATE status = "assigned"';
    pool.query(qry, [employeeUserId, moduleId], (err, results) => {
        if (err) {
            console.error('Error enrolling employee in training module:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Employee enrolled in training module successfully' });
    });
});

router.get('/enroll-modules/:selectedOption', (req, res) => {
    const selectedOption = req.params.selectedOption;
    
    const qry = `
        SELECT tm.module_id, tm.module_name
        FROM training_modules tm
        WHERE NOT EXISTS (
            SELECT * 
            FROM user_training_modules utm 
            WHERE tm.module_id = utm.module_id 
            AND utm.user_id = ?);
    `;
    pool.query(qry, [selectedOption], (err, results) => {
        if (err) {
            console.error('Error fetching training modules:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

router.get('/unenroll-modules/:selectedOption', (req, res) => {
    const selectedOption = req.params.selectedOption;
    
    const qry = `
        SELECT utm.user_id, utm.module_id, tm.module_name, utm.status
        FROM user_training_modules utm
        JOIN training_modules tm ON utm.module_id = tm.module_id
        WHERE utm.user_id = ? AND utm.status = 'assigned';
    `;
    pool.query(qry, [selectedOption], (err, results) => {
        if (err) {
            console.error('Error fetching training modules:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});


router.delete('/unenroll-employee-training', (req, res) => {
    const { employeeUserId, moduleId } = req.body;

    const qry = 'DELETE FROM user_training_modules WHERE user_id = ? AND module_id = ? AND status = "assigned"';
    pool.query(qry, [employeeUserId, moduleId], (err, results) => {
        if (err) {
            console.error('Error unenrolling employee from training module:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ success: true, message: 'Employee unenrolled from training module successfully' });
    
    });
});


router.get('/employees/organization/:organizationId', (req, res) => {
    const organizationId = req.params.organizationId;
    
    const qry = `
        SELECT user_id, first_name, last_name, email
        FROM users
        WHERE organization_id = ? AND user_role != 'management';
    `;
    
    pool.query(qry, [organizationId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err });
        }
        
        res.json(result);
    });
});

router.post('/api/goals', (req, res) => {
    const { organizationId, dueDate, incentive } = req.body;
    
    // Assuming your `pool` variable is properly set up for database operations
    const query = `INSERT INTO goals (organization_id, due_date, incentive) VALUES (?, ?, ?)`;
    pool.query(query, [organizationId, dueDate, incentive], (error, results) => {
        if (error) {
            console.error('Failed to set goal:', error);
            res.status(500).json({ success: false, message: 'Failed to set goal' });
        } else {
            res.json({ success: true, message: 'Goal set successfully' });
        }
    });
});

router.get('/goals/latest/:organizationId', async (req, res) => {
    const organizationId = req.params.organizationId;

    const query = `
        SELECT * FROM goals 
        WHERE organization_id = ? 
        ORDER BY due_date DESC 
        LIMIT 1;
    `;

    try {
        const [result] = await pool.promise().query(query, [organizationId]);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "No goals found for this organization." });
        }
    } catch (error) {
        console.error('Failed to fetch latest goal:', error);
        res.status(500).json({ message: 'Failed to fetch latest goal', error });
    }
});

router.get('/leaderboard/:organizationId', (req, res) => {
    const organizationId = req.params.organizationId; 
    
    const qry = `
    SELECT user_id, first_name, last_name, organization_id, score
    FROM users
    WHERE organization_id = ? AND user_role != 'managment'
    ORDER BY score DESC;`

    pool.query(qry, [organizationId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err });
        } else {
            // Calculate leaderboard ranks dynamically
            const leaderboard = result.map((user, index) => ({
              ...user,
              rank: index,
            }));

        res.json(leaderboard);
        }
    });
});

router.post('/start-module/:userId/:moduleId', async (req, res) => {
    const { userId, moduleId } = req.params;
    const startTime = new Date();

    const updateStartTime = `
        UPDATE user_training_modules
        SET start_time = ?
        WHERE user_id = ? AND module_id = ?;
    `;

    pool.query(updateStartTime, [startTime, userId, moduleId], (err, result) => {
        if (err) {
            console.error('Error starting training module:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Training module started successfully' });
    });
});

router.post('/start-training', async (req, res) => {
    const { userId, moduleId } = req.body;
    const startTime = new Date();

    const updateStartTime =  `
        UPDATE user_training_modules
        SET start_time = ?
        WHERE user_id = ? AND module_id = ?;
    `;

    pool.query(updateStartTime, [startTime, userId, moduleId], (err, result) => {
        if(err) {
            console.error('Error starting training module:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Training module started successfully' });
    });
});

router.get('/module/:moduleId', async (req, res) => {
    const moduleId = req.params.moduleId;

    const query = 'SELECT * FROM training_modules WHERE module_id = ?';

    try {
        const [result] = await pool.query(query, [moduleId]);
        if (result.length > 0) {
            res.json(result[0]); // Assuming you want to return only one module
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error) {
        console.error('Error fetching module details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});




module.exports = router;