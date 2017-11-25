var mongoose = require("mongoose");
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

module.exports = mongoose.model("user",userSchema);