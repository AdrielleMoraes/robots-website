var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose");

//server these folders
app.use(express.static("views"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

//mongodb database
mongoose.connect("mongodb://localhost/robots");

//shema setup
var robot_schema = new mongoose.Schema(
    {
        name: String,
        image: String
    }
);

//create model of our schema
var Robot = mongoose.model("Robot", robot_schema);



app.get("/robots", function(req,res){
       
    //retrieve robots from db
    Robot.find({},function(err, robots){
        if(err) return console.log(err);
        else{
            res.render("robots.ejs", {robots: robots});
        }
    })
    
});


app.get("/robots/new", function(req,res){
    res.render("new.ejs");
});

app.get("/*",function(req,res){
    res.render("landing.ejs");
});

app.post("/robots", function(req, res){
    //get data from form and add to database
    let name = req.body.name;
    let image = req.body.image;

    if(name == "" || image == "")
    {
        res.redirect("/robots/new");
        return;
    }

    let newRobot = {name: name, image: image};

    //database
    //save robots
    Robot.create(newRobot), function(error, bot){
        if(error)   return console.log(error);
        else    console.log(bot);
    };

    //redirect back to robots page
    res.redirect("/robots");
});

app.listen(3000,function(){

    console.log("Server started");
});