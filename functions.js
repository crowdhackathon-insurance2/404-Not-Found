var mongoose = require("mongoose");
var user = require("./user.js");


function insert(data){
    var newUser = {name: data.name,surname: data.surname,phone: data.phone,email: data.email,dob: data.dob,job: data.job,possessions: data.possessions,location: data.location,maritalStatus: data.maritalStatus};
    user.create(newUser, function(err, newCreated){
        if(err){
            console.log(err);
        }
        else{
            console.log("Created a user");
        }
    });
}