var express = require("express");
var router = express.Router();
var Robot = require("../models/robot");
var middleware = require("../middleware");


//get requests

//list all robots
router.get("/", function(req,res){
       
    //retrieve robots from db
    Robot.find({},function(err, robots){
        if(err) return console.log(err);
        else{
            res.render("robots.ejs", {robots: robots, });
        }
    })
    
});

//new robot
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("new.ejs");
});

//show more info about robot
router.get("/:robotId", function(req,res){
    //find robot with id and show template with that robot and comments
    Robot.findById(req.params.robotId).populate("comments").exec(function(error, robot){
        if(error)   console.log(error);
        else{
            res.render("show.ejs", {robot : robot});
        }
    }); 
});


// edit robot
router.get("/:id/edit", middleware.checkOwnership, (req,res)=>{
    //find robot
    Robot.findById(req.params.id, (error, foundRobot)=>{
        //show edit page
        res.render("edit.ejs", {robot: foundRobot});          
    });
});

//post requests
//create new robot
router.post("/new", middleware.isLoggedIn, function(req, res){
    //get data from form and add to database
    if(req.body.robot.name == "" || req.body.robot.image == "")
    {
        req.flash("error", "These fields are mandatory");
        res.redirect("/robots/new");
        return;
    }

    //database
    //save robots
    Robot.create(req.body.robot, function(error, bot){
        if(error)   return console.log(error);
        else    {
            //assign author username and id
            var author = {
                username: req.user.username,
                id: req.user._id
            }
            bot.author = author;
            bot.save();
        }
    });
    //redirect back to robots page
    req.flash("success", "Brand new robot included to our database");
    res.redirect("/");
});

//edit robot
router.put("/:id", middleware.checkOwnership, (req,res)=>{
    //find and update robot
    Robot.findByIdAndUpdate(req.params.id, req.body.robot, (error, updatedRobot)=>{
        if (error){
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
        //redirect to showpage
        else
            req.flash("success", "Robot " + updatedRobot.name +" updated succesfully");
            res.redirect("/robots/"+req.params.id);
    });
    
});

// destroy robot
router.delete("/:id", middleware.checkOwnership, async(req,res)=>{
    try {
        let foundRobot = await Robot.findById(req.params.id);
        await foundRobot.remove();
        req.flash("success", "Robot deleted succesfully");
        res.redirect("/robots");
      } catch (error) {
        console.log(error.message);
        req.flash("error", "Something went wrong");
        res.redirect("/robots");
      }
});

module.exports = router;