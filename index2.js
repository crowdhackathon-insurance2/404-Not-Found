//https://insurance2.herokuapp.com/


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// var facebook = require("./myfacebook");
// var postgres = require("postgres");
// const { Client } = require('pg');

var promise = require('bluebird');

var options={
    promiseLib:promise
};

var pg = require('pg');
const connectionString = 'postgres://rumafcgcwsyjlb:eaf3365f4a05d93e258be549c003895fd324a558615609168a13fcbe403da14b@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/dc3qigg78skadb';
pg.connect(connectionString,onConnect);

function onConnect(err,client,done){
    if(err){
        console.error(err);
        process.exit(1);
    }
    client.end();
}


function getUser(req,res,next){
    var userID = parseInt(req.params.id);
    app.one('select * from users where id = $1',userID)
        .then(function(data){
            res.status(200)
            .json({
                status:'success',
                data:data,
                message: 'Retrieved user'
            });
        })
        .catch(function(err){
            return next(err);
        });
}

app.get("/",function(req,res){
    res.send("HI");
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});