var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/Blog", {
    useMongoClient : true
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title  : String,
    img    : String,
    body   : String,
    date   : {type : Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);


app.get("/", function(req ,res){
    res.render("landing");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, result){
        if(err){
            console.log(err);
        }else{
              res.render("index", {results: result}); 
        }
    });
});

app.get("/blogs/new",function(req, res){
   res.render("new"); 
});

app.post("/blogs", function(req, res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        Blog.create(
            req.body.blog
        , function(err, result){
            if(err){
                console.log(err);
            }else{
                res.redirect("/blogs");
            }
        });
});

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, result){
        if(err){
            res.redirect("/blogs");
        }else{
               res.render("show" ,{result : result});
        }
    })

});

app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, result){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit",{result: result});
       }
   })
});

app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, result){
     if(err){
         res.redirect("/blogs")
     } else{
         res.render("show",{result : result});
     }
  });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Ready for takeoff!");
});

