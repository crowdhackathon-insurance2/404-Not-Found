//https://insurance2.herokuapp.com/


var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");

var db = require('./queries');


router.get('/users/:id');

module.exports = router;



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});