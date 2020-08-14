var Robot = require("../models/robot");
var Comment = require("../models/comment");
//all the middleware goes were
var middlewareObj = {};


middlewareObj.checkOwnership = function(req,res,next){
    //middleware to check if user has authorisation to edit robot
    //is user logged in?
    if(req.isAuthenticated())
    {
        //find robot
        Robot.findById(req.params.id, (error, foundRobot)=>{
        if(error){
            req.flash("error", "Robot not found");
            res.redirect("back");
        }
        else{
            // check if robot exists
            if(!foundRobot){
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            //does user keep robot?
            if(foundRobot.author.id.equals(req.user._id))
                return next();
            else{
                req.flash("error", "You don't have permission for this action");
                res.redirect("back");
            }
        }           
        });
    }
    else
        res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    //middleware to check if user has authorisation to edit robot
    //is user logged in?
    if(req.isAuthenticated())
    {
        //find comment
        Comment.findById(req.params.commentId, (error, foundComment)=>{
        if(error){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
        else{
            if(!foundComment){
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            //does user keep robot?
            if(foundComment.author.id.equals(req.user._id))
                return next();
            else{
                req.flash("error", "You need to be logged in to continue!");
                res.redirect("back");
            }
        }           
        });
    }
    else
        res.redirect("/login");
}

middlewareObj.isLoggedIn = function(req,res,next){
//middleware to check if user is logged in
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to continue!");
    res.redirect("/login");
}
module.exports = middlewareObj;