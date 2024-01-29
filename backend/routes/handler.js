const express = require('express');
const router = express.Router();

router.get('/Signup', (req, res) => {
    const str = [
        {
            "name": "Kyle Pait",
            "password": "this is not my password",
            "email": "kylepait@gmail.com"
        }
    ];
    res.end(JSON.stringify(str));
});

router.post('/addUser', (req, res) => {
    res.end('NA');
});

module.exports = router;