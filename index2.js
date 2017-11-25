//https://insurance2.herokuapp.com/


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// var facebook = require("./myfacebook");
// var postgres = require("postgres");
const pg= require('pg');
var url = "postgres://rumafcgcwsyjlb:eaf3365f4a05d93e258be549c003895fd324a558615609168a13fcbe403da14b@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/dc3qigg78skadb";
const  connectionString = url;
const client = new pg.client(connectionString);
client.connect();

var postgresUrl = process.env.DATABASEURL;

const query = client.query('CREATE TABLE users(id PRIMARY KEY,text VARCHAR(40)');

// query.prototype.sql1 = function(query){
        
// };

app.post('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
   res.send("") 
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});