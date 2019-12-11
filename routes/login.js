var express=require("express")
var app=express()
var router=express.Router()

router.post("/",function(req,res){
    console.log(req.body.name)
    console.log(req.body.id)
    res.render('../views/main.ejs', { id: req.body.id,password:req.body.password });
})
module.exports=router