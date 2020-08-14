var express = require("express");
var router = express.Router({mergeParams:true}); //pas this property to use :id from url
var Robot = require("../models/robot");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//ad new comment
router.post("/", middleware.isLoggedIn, (req,res) =>{
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
router.get("/comments/:commentId/edit", middleware.checkCommentOwnership,(req,res)=>{
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
router.delete("/:commentId",middleware.checkCommentOwnership, (req,res)=>{
 
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

router.put("/comments/:commentId", middleware.checkCommentOwnership, (req,res)=>{
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


module.exports = router;