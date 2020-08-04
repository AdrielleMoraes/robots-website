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

// edit comment
router.get("/comments/:commentId/edit", checkOwnership,(req,res)=>{
    //find robot
    Robot.findById(req.params.robotId).populate("comments").exec(function(error, foundRobot){
        Comment.findById(req.params.commentId, (error, foundComment)=>{
            if(error)
                console.log(error);
            else
                //show edit page
                console.log(foundComment);
                res.render("show.ejs", {robot: foundRobot, editComment: foundComment});    
        })
             
    });
});

// destroy comment
router.delete("/:commentId",checkOwnership, (req,res)=>{
 
    Comment.findByIdAndRemove(req.params.commentId, (error)=>{
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            res.redirect("/robots/"+req.params.robotId);
        }
    });

});

router.put("/comments/:commentId", checkOwnership, (req,res)=>{
    //find and update comment
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (error, updatedComment)=>{
        if (error){
            res.redirect("/");
        }
        //redirect to showpage
        else
            res.redirect("/robots/"+req.params.robotId);
    });
    
});


//middleware to check if user has authorisation to edit robot
function checkOwnership(req,res,next){
    //is user logged in?
    if(req.isAuthenticated())
    {
        //find comment
        Comment.findById(req.params.commentId, (error, foundComment)=>{
        if(error){
            res.redirect("back");
        }
        else{
            //does user keep robot?
            if(foundComment.author.id.equals(req.user._id))
                return next();
            else{
                res.redirect("back");
            }
        }           
        });
    }
    else
        res.redirect("/login");
}

//middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;