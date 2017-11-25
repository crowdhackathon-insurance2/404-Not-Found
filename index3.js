var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var user = require("./user.js");
var seedDB = require("./seeds.js");

var url = process.env.DATABASEURL || "mongodb://localhost/clients"

mongoose.connect(url, {useMongoClient: true});
mongoose.connect("mongodb://kleanupguy7:panos123@ds143734.mlab.com:43734/insurance")
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

app.get("/", function(req, res){
   res.send("Skata"); 
});