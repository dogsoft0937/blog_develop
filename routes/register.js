var express=require("express")
var app=express()
var router=express.Router()
var mysql=require("mysql")
var path=require("path")
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
    result=req.body
    uname=result.name
    uid=result.id
    upw=result.password
    if(uname&&uid&&upw){
        var selectquery="select * from user where id=?"
        connection.query(selectquery,uid,function(error,result){
            if(error){
                console.log(error)
            }else{
                if(result.length==0){
                    var insertquery="insert into user(name,id,password) values(?,?,?)"
                    var data=[uname,uid,upw]
                    connection.query(insertquery,data,function(error,result){
                        if(error){
                            console.log(error)
                        }else{
                            res.render(path.join(__dirname,"../views/main.ejs"), { name:uname,id:uid,password:upw,notice:"회원가입 성공" });
                        }
                    })
                }else{
                    res.render(path.join(__dirname,"../views/register.ejs"),{notice:"존재하는 계정입니다."})
                }
            }
        })
        
    }else{
        res.render(path.join(__dirname,"../views/register.ejs"),{notice:"회원 정보가 부족합니다."})
    }
})
module.exports=router