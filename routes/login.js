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
router.post("/",function(req,res){
    uid=req.body.id
    upw=req.body.password
    console.log(uid,upw)
    if(uid&&upw){
        connection.query("SELECT * from user where id='"+uid+"'",function(error,result){
            if(error){
                console.log(error)
            }else{
                if(result.length>0){
                    if(uid==result[0].id){
                        if(upw===result[0].password){
                            res.render("../views/main.ejs",{id:uid,password:upw})
                        }else{
                            res.render("../views/index.ejs",{notice:"비밀번호가 맞지않습니다."})
                        }
                    }
                    res.render("../views/index.ejs",{notice:"비밀번호가 맞지않습니다."})
                }else{
                    res.render("../views/index.ejs",{notice:"존재하지 않는 계정입니다."})
                }
            }
        })
    }
})
module.exports=router