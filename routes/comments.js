var express = require("express");
var router = express.Router({mergeParams:true}); //pas this property to use :id from url
var Robot = require("../models/robot");
var Comment = require("../models/comment");

//ad new comment
router.post("/",isLoggedIn, (req,res) =>{
    Robot.findById(req.params.robotId, (err, bot)=>{
        if(err) return console.log(err);
        else{   
            //save comment
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) return console.log(err);
                else{
                    //add username and id to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    //save comment
                    comment.save();
                    bot.comments.push(comment);
                    bot.save();
                    // return to page
                    res.redirect("/robots/"+req.params.robotId);
                }
            });           
        }
    });  
});

//middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;