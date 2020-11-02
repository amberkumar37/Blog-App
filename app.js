var express= require("express");
var mongoose= require("mongoose");
var bodyParser= require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

var app = express();
mongoose.connect("mongodb://localhost:27017/blog_app",{ useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    tittle:String,
    image:String,
    body:String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);




app.get("/",function(req,res){
    res.redirect("blog");
});

 app.get("/blog",function(req,res){
     Blog.find({}, function(err,blog){
         if(err){
             console.log("error");
         } else {
           res.render("index", {blog:blog});   
         }
     });
     
 });

 app.get("/blog/new", function(req, res){
     res.render("new");
 });
 
 app.post("/blog",function(req, res){
     console.log(req.body);
     req.body.blog.body = req.sanitize(req.body.blog.body)
     console.log("=============");
     console.log(req.body);
     Blog.create(req.body.blog, function(err, newBlog){
     if(err){
         res.render("new");
       }    else{
         res.redirect("/blog");
      }
     
    });
 
 });
 
 app.get("/blog/:id", function(req,res){
     Blog.findById(req.params.id, function(err,foundblog){
         if(err){
             res.redirect("/blog");
         } else {
             res.render("show", {blog:foundblog})
         }
     });
     
 });
 
 app.get("/blog/:id/edit",function(req,res){
     Blog.findById(req.params.id,function(err,foundblog){
         if(err){
             res.redirect("/blog");
         } else{
             res.render("edit",{blog:foundblog})
         }
     });
   
 });
 
 app.put("/blog/:id",function(req,res){
     req.body.blog.body = req.sanitize(req.body.blog.body)
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updateblog){
         if(err){
             res.redirect("/blog");
         } else {
             res.redirect("/blog/" + req.params.id);
         }
     });
     
 });
 
 app.delete("/blog/:id",function(req,res){
     Blog.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/blog");
         } else{ 
             res.redirect("/blog");
         }
     });
 });
 
 app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server has starts");
});
