var express         = require("express"), //server side
    app             = express(),
    bodyParser      = require('body-parser'),

    //flash messages
    flash = require("connect-flash");
    //put request 
    methodOverride= require("method-override");

    //db and db models
    mongoose        = require("mongoose"),
    Robot           = require("./models/robot"),
    Comment         = require("./models/comment"),
    User            = require("./models/user.js")
    seedDB          =  require("./seeds"),

    //user authentication
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    passportLocalM  = require("passport-local-mongoose");


//routes
var robotsRoutes = require("./routes/robots"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/auth");


//mongodb database
mongoose.connect("mongodb://localhost/robots", { useUnifiedTopology: true, useNewUrlParser: true});


//flash messages config
app.use(flash());

//run this to restart db and populate examples
//seedDB();


//server these folders
app.use(express.static("views"));
app.use(express.static("public"));

// use this for put requests
app.use(methodOverride("_method"));

//get info from body req
app.use(bodyParser.urlencoded({extended: true}));


//user authentication
app.use(require("express-session")({
    //encode each session
    secret: "rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//encode session
passport.deserializeUser(User.deserializeUser());//decode session


// use this to correct navbar login buttons issue
app.use((req,res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


//routes
app.use("/robots", robotsRoutes);
app.use("/robots/:robotId", commentRoutes);
app.use(authRoutes);


//al other routes
app.get("/*",function(req,res){
    res.render("landing.ejs");
});


app.listen(3000,function(){

    console.log("Server started");
});