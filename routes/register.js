var express=require("express")
var app=express()
var router=express.Router()
var mysql=require("mysql")

var connection=mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"P@ssw0rd",
    database:"blog"
})
connection.connect()
router.get("/",function(req,res){
    res.render("../views/register")
})
router.post("/",function(req,res){
    console.log(req.body.name)
    console.log(req.body.id)
    console.log(req.body.password)
    res.render('../views/main.ejs', { name:req.body.name,id: req.body.id,password:req.body.password });
})
module.exports=router