//https://insurance2.herokuapp.com/


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// var facebook = require("./myfacebook");
// var postgres = require("postgres");
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
   res.send("rigrgrigrg");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});