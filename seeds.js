var mongoose = require("mongoose");
var user = require("./user.js");

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
                        user.save();
                  }
               });
            });
        }
    });
}







