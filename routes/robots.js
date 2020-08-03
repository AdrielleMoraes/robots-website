var express = require("express");
var router = express.Router();
var Robot = require("../models/robot");


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
router.get("/new", isLoggedIn, function(req,res){
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
router.get("/:id/edit", (req,res)=>{
    //is user logged in?
        if(req.isAuthenticated())
        {
            //find robot
            Robot.findById(req.params.id, (error, foundRobot)=>{
            if(error){
                res.redirect("/");
            }
            else{
                //does user keep robot?
                console.log(foundRobot);
                if(foundRobot.author.id.equals(req.user._id))
                    res.render("edit.ejs", {robot: foundRobot});
                else{
                    res.send("you do not have permission to do that");
                }
            }
                
            });
        }
        else{
            res.redirect("/login");
        }
});

//post requests
//create new robot
router.post("/new", isLoggedIn, function(req, res){
    //get data from form and add to database
    if(req.body.robot.name == "" || req.body.robot.image == "")
    {
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
    res.redirect("/");
});

//edit robot

router.put("/:id", (req,res)=>{
    //find and update robot
    Robot.findByIdAndUpdate(req.params.id, req.body.robot, (error, updatedRobot)=>{
        if (error){
            res.redirect("/");
        }
        //redirect to showpage
        else
            res.redirect("/robots/"+req.params.id);
    });
    
});

// destroy robot
router.delete("/:id", async(req,res)=>{
    try {
        let foundRobot = await Robot.findById(req.params.id);
        await foundRobot.remove();
        res.redirect("/robots");
      } catch (error) {
        console.log(error.message);
        res.redirect("/robots");
      }
});

//middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;