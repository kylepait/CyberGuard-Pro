const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const pool = require('./config/db.js')

require(dotenv/config);

//Database connection
pool.getConnection( (err, conn) =>{
    if (err) throw err;
})

/** 
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);
*/
const PORT = 3306; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});