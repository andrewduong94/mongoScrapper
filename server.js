const express = require("express");
const bodyParser = require("body-parser")
const logger = require("morgan");
const mongoose = require("mongoose");

//Scrapping tools
const axios = require("axios");
const cheerio = require("cheerio");

//Require all models 
const db = require("./models");

const PORT = process.env.PORT || 3000;

//Init Express
const app = express();

//Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");


//Config requests
app.use(logger("dev"));

//Use morgan logger for logging requests
app.use(bodyParser.urlencoded({extended: true}));

//Use express static to serve public folder as a static dir
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScapper";

// Set mongoose to leverage built in JavaScript ES6 Promises
//Connect to Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//ROUTES

app.get("/", function(req, res){
    db.Articles.find({"saved": false}, function(error, data) {
        var hbsObject = {
            article: data
        };
        res.render("index", hbsObject)
    })
});

app.get("/scrape", function(req, res){
    axios.get("https://www.nytimes.com/section/world").then(function(response){
        var $ = cheerio.load(response.data);
        $("article.story").each(function(i, element){
            var result = {};
            
            if ($(element).find("a.story-link").attr("href") && $(element).find("h2").text() && $(element).find("p.summary").text()){
                result.link = $(element).find("a.story-link").attr("href");
                result.title = $(element).find("h2").text();
                result.desc = $(element).find("p.summary").text()
            };

             db.Articles.create(result)
                .then(function(dbArticle){
                     console.log(dbArticle);
                 })
                .catch(function(err){
                    return res.json(err);
                 })

         })
        
        res.send("Scrape Complete");
    })
});

app.get("/articles", function(req,res){
    db.Articles.find({})
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        })
})

app.delete("/articles", function(req,res){
    db.Articles.deleteMany({}) 
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        })
})

app.get("/saved", function(req,res){
    db.Articles.find({saved: true}, function(error, data){
        var hbsObject = {
            savedArticles: data
        };
        res.render("saved", hbsObject)
    })    
});

app.put("/articles/:id", function(req, res){
    db.Articles.update({_id: req.params.id}, {$set: {saved: true}}, function(err, doc) {
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
})

app.put("/delete/articles/:id", function(req, res){
    db.Articles.update({_id: req.params.id}, {$set: {saved: false}}, function(err, doc) {
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
})



//Start server
app.listen(PORT, function(){
    console.log(`app is running on port: ${PORT}`);
});
