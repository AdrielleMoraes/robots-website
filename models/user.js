var mongoose        = require("mongoose");
var passportLocalM  = require("passport-local-mongoose");

var user_schema = new mongoose.Schema({
    username: String,
    password: String,
    image : String
});

//add methods to user schema to encode and decode sessions
user_schema.plugin(passportLocalM);
module.exports = mongoose.model("User", user_schema);