//https://insurance2.herokuapp.com/


var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");

var db = require('./queries');


router.get('/users/:id',db.getUser);

module.exports = router;