var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var url = process.env.DATABASEURL || "mongodb://localhost/clients"
// mongoose.Promise = require('bluebird');

mongoose.connect(url, {useMongoClient: true});
//mongoose.connect("mongodb://kleanupguy7:panos123@ds143734.mlab.com:43734/insurance")
app.use(bodyParser.urlencoded({extended: true}));


var userSchema = new mongoose.Schema({
   name: String,
   surname: String,
   phone: String,
   email: String,
   dob: String,
   job: String,
   possessions: String,
   location: String,
   maritaStatus: String
});


var data = [
    {
        name: "Stefanos",
        surname: "Dianellos",
        phone: "69054545",
        email: "ffs@gmail.com",
        dob: "1-1-91",
        job: "teacher",
        possessions: "2nd house",
        locationOfPrimaryHouse: "Sounio",
        maritalStatus: "married"
    },
    {
        name: "Panos",
        surname: "Panagiotidis",
        phone: "69054545",
        email: "ffs@gmail.com",
        dob: "1-1-91",
        job: "teacher",
        possessions: "2nd house",
        locationOfPrimaryHouse: "Sounio",
        maritalStatus: "married"
    }
]
var user=mongoose.model("user",userSchema);
function seedDB() {

    user.remove({}, function(err){
       if(err){
           console.log(err);
       }

        else{
            console.log("removed users");
            data.forEach(function(seed){
               user.create(seed,function(err,users){
                  if(err){
                      console.log(err);
                  }
                  else{
                    console.log("added a user");
                    users.save();
                  }
               });
            });
        }
    });
}

seedDB();
