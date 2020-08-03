var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js")

//show sign up form
router.get("/register", (req,res)=>{
    res.render("register.ejs");
});

//log in form
router.get("/login", (req, res)=>{
    res.render("login.ejs");
})

//log out handler
router.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/login");
});

//post requests
//handling user sign up
router.post("/register", (req, res)=>{
    //create a new user
    User.register(new User({username: req.body.username}), req.body.password, (error, user)=>{
        if(error){
            console.log(error);
            return res.render("register.ejs");
        } 
        console.log(user);

        passport.authenticate("local")(req, res, function(){
            console.log("im here");
            res.redirect("/");
        });
    });
});

//handle login page with middleware
router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}),(req,res)=>{

});


//middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;