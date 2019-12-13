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
        var query="select * from user where id=?"
        connection.query(query,uid,function(error,result){
            if(error){
                console.log(error)
            }else{
                if(result.length>0){
                    if(uid==result[0].id){
                        if(upw===result[0].password){
                            res.render("../views/main.ejs",{name:result[0].name,id:uid,password:upw,notice:"로그인 성공"})
                        }else{
                            res.render("../views/index.ejs",{notice:"비밀번호가 맞지않습니다."})
                        }
                    }
                }else{
                    res.render("../views/index.ejs",{notice:"존재하지 않는 계정입니다."})
                }
            }
        })
    }else{
        res.render("../views/index.ejs",{notice:"아이디 또는 비밀번호를 입력하세요"})
    }
    //json값으로 프론트에 뿌려주기
    //res.json({message : '200 OK'}) 
})
module.exports=router