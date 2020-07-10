var express = require("express");
var app = express();

var bodyParser = require('body-parser')

//server these folders
app.use(express.static("views"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));


var robots = [
    {name:"Rocky", image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=739&q=80"},
    {name: "BB-8", image: "https://images.unsplash.com/photo-1592513809429-4a3458537099?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
    {name: "Wall-E", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80"},
    {name: "EVE", image: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=866&q=80"},
    {name:"C-ePO", image:"https://images.unsplash.com/photo-1581481615985-ba4775734a9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80"},
    {name:"Rocky", image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=739&q=80"},
    {name: "BB-8", image: "https://images.unsplash.com/photo-1592513809429-4a3458537099?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
    {name: "Wall-E", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80"},
    {name: "EVE", image: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=866&q=80"},
    {name:"C-ePO", image:"https://images.unsplash.com/photo-1581481615985-ba4775734a9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80"}
]

app.get("/robots", function(req,res){

    res.render("robots.ejs", {robots: robots});

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

    let newRobot = {name: "", image:""};
    if (name == "" || image == "") {
        newRobot = robots[Math.floor(Math.random() * robots.length)]
    } else {
        newRobot = {name: name, image:image};
    }
    robots.push(newRobot);
    //redirect back to robots page
    res.redirect("/robots");
});

app.listen(3000,function(){

    console.log("Server started");
});