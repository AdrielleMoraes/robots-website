var mongoose = require("mongoose");
const Comment = require('./comment');

//shema setup
var robot_schema = new mongoose.Schema(
    {
        author: {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "author"
            },
            username: String
        },
        name: String,
        image: String,
        description: String,
        comments:   [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                    }]
    }
);

//remove all comments assiciated with this robot
robot_schema.pre('remove', async function() {
    await Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});

//create model of our schema and export this module for future use
module.exports = mongoose.model("Robot", robot_schema);

