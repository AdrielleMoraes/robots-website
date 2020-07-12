var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose");

//server these folders
app.use(express.static("views"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

//mongodb database
mongoose.connect("mongodb://localhost/robots", { useUnifiedTopology: true, useNewUrlParser: true});

//shema setup
var robot_schema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String,
    }
);

//create model of our schema
var Robot = mongoose.model("Robot", robot_schema);

// var r = [   { name: "Wall-E",    image: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "In love with EVE..."},
//             { name: "Rocky",    image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Must recharge batteri......"},
//             { name: "Xr-47",    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "01001000 01100101 01101100 01101100 01101111 00100000 01101000 01110101 01101101 01100001 01101110" },
//             { name: "C-3P0",    image: "https://images.unsplash.com/photo-1581481615985-ba4775734a9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Hello. I don't believe we have been introduced. A pleasure to meet you. I am C-3PO, Human-Cyborg Relations." },
//             { name: "Wall-E",    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Wall.....E?" },
//             { name: "Bert",    image: "https://images.unsplash.com/photo-1549145159-2f1242ce0975?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",    description: "Let's play together"},
//             { name: "Frogg-E",    image: "https://images.unsplash.com/photo-1586374579358-9d19d632b6df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",    description: "Beeeeep Bop?" }
//         ];

//     //save robots
//     Robot.create(r), function(error, bot){
//         if(error)   return console.log(error);
//         else    console.log(bot);
//     };


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

//show ,ore info about robot
app.get("/robots/:robotId", function(req,res){
    //find robot with id and show template with that robot
    Robot.findById(req.params.robotId, function(error, robot){
        if(error)   console.log(error);
        else{
            res.render("show.ejs", {robot : robot});
        }
    }); 
});

app.get("/*",function(req,res){
    res.render("landing.ejs");
});



app.post("/robots", function(req, res){
    //get data from form and add to database
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;

    if(name == "" || image == "")
    {
        res.redirect("/robots/new");
        return;
    }

    let newRobot = {name: name, image: image, description: desc};

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