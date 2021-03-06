var  bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	express = require("express"),
	app = express(),
	methodOverride= require('method-override'),
	expressSanitizer = require('express-sanitizer');


//App config
// mongoose.connect("mongodb://localhost/restful_blog_app");	
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://aadarsh:aadarsh123@ds147510.mlab.com:47510/restful_app_db");	

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


app.use(expressSanitizer()); //Keep it aafter body parser
//Mongoose model config
var blogSchema = new mongoose.Schema({
	title : String,
	image : String,
	body : String,
	created : {type:Date, default:Date.now}//Similar thing can be done for image of the ubody
});

var Blog = mongoose.model("Blog",blogSchema);


//Restful routes
app.get("/",function(req,res){
	res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("Error");
		}
		else{
			res.render("index.ejs",{blogs:blogs});
		}
	})
});

app.get("/blogs/new",function(req,res){
	res.render("new.ejs");
})

app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
		{
			res.render("new");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
})


app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else{
			res.render("show.ejs",{blog:foundBlog});
		}
	})
});

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else{
			res.render("edit.ejs",{blog:foundBlog});
		}
	})
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
});

app.listen(process.env.PORT  || 3000,function(){
	console.log("Server is running");
})