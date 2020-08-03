var mongoose = require("mongoose");
var Robot = require("./models/robot");
var Comment = require("./models/comment");

var commonAuthor = {
    id : "5f14c6bcbfe6814b2a390064",
    username : "user",
}

var r = [   { name: "Wall-E", author: commonAuthor,    image: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "In love with EVE..."},
            { name: "Rocky", author: commonAuthor,    image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Must recharge batteri......"},
            { name: "Xr-47", author: commonAuthor,    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "01001000 01100101 01101100 01101100 01101111 00100000 01101000 01110101 01101101 01100001 01101110" },
            { name: "C-3P0", author: commonAuthor,    image: "https://images.unsplash.com/photo-1581481615985-ba4775734a9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Hello. I don't believe we have been introduced. A pleasure to meet you. I am C-3PO, Human-Cyborg Relations." },
            { name: "Wall-E", author: commonAuthor,    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Wall.....E?" },
            { name: "Bert", author: commonAuthor,    image: "https://images.unsplash.com/photo-1549145159-2f1242ce0975?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Let's play together"},
            { name: "Frogg-E", author: commonAuthor,    image: "https://images.unsplash.com/photo-1586374579358-9d19d632b6df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",    description: "Beeeeep Bop?" },
            { name: "My Family", author: commonAuthor,    image: "https://images.unsplash.com/photo-1582571352032-448f7928eca3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Love them to the moon and back!" }
        ];
        
function seedDB(){

    //remove everything from database
    Robot.remove({}, function(err){
        if(err) return console.log(err);
        else 
        {
            r.forEach((robot)=>{
                //save robots
                Robot.create(robot, (err, bot)=>{
                    if(err)   console.log(err);
                    else    
                    {
                        //add a fake comment
                        //create a comment
                        Comment.create(
                            {
                                text: "Hello, miss you", 
                                author: commonAuthor
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    bot.comments.push(comment);
                                    bot.save();
                                }
                            });
                    }
                });
            }); 
        } 
    });
}

//execute seedDB
module.exports = seedDB;