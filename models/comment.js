var mongoose = require("mongoose");

//comment schema
var comment_Schema = new mongoose.Schema({
    author: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "author"
            },
        username: String
    },
    text: String,
    created: {type: Date, default: Date.now}
})




//export model
module.exports = mongoose.model("Comment", comment_Schema);