const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const pool = require('./config/db.js')

require('dotenv/config');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);

//Database connection
pool.getConnection( (err, conn) =>{
    if (err) throw err;

    const username = 'testUsername';
    const password = 'testPassword';
    const organization_id = 'testOrg';

    const qry = 'INSERT INTO users_table(username, password, organization_id) VALUES(?,?,?)'
    conn.query(qry, [username, password, organization_id], (err, result) => {
        conn.release();
        if (err) throw err;
        console.log(result);
    });

});

/** 
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);
*/
const PORT = process.env.PORT || 4000; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});