var express=require("express")
var app=express()
var bodyParser = require('body-parser');
var path = require('path');
var http=require("http").createServer(app),port=3000
var auth=require("./routes/auth")

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname + "/views"));
app.use("/auth",auth)
app.get("/",function(req,res){
  // res.sendFile(path.join(__dirname,"/views/index.html"))
  res.render(path.join(__dirname,"/views/index"))
})
http.listen(port,function(){
  console.log("http://localhost:3000")
})

module.exports=app
