const express = require("express");
const mysql2 = require("mysql2")
const bodyParser = require("body-parser")
const dns = require('node:dns');
const dotenv = require("dotenv").config()
const doIP = dns.lookup('db-mysql-nyc3-75731-do-user-15577760-0.f.db.ondigitalocean.com', (err) => console.log(err || 'node can access the internet'));


const app = express();
const PORT = process.env.PORT || 3000;
//Middleware
app.use(bodyParser.json());
//MySQL Connection
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB,
    port: process.env.DB_PORT
});
// Connect to MySQL
db.connect((err) => {
    if(err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as ID " + db.threadId);
});
//Routes
app.get("/api/movies", (req, res) => {
    db.query("SELECT * FROM movies", (err, results) => {
        if (err) {
            console.error("Error executing query: " + err.stack);
            res.status(500).send("Error fetching movies");
            return;
        }
        res.json(results);
    });
});
//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})