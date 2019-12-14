var express=require("express")
var app=express()
var router=express.Router()
var path = require('path');
var mysql=require("mysql")
var session=require("express-session")
var mysqlstore=require("express-mysql-session")(session)
var flash=require("connect-flash")

var options={
    host:"localhost",
    port:3306,
    user:"root",
    password:"P@ssw0rd",
    database:"blog"
}
var sessionstore=new mysqlstore(options)
router.use(session({
    secret:"mdkawlgawmlk",
    resave:false,
    saveUninitialized:true,
    store:sessionstore
}))
var passport=require("passport")
  , LocalStrategy = require("passport-local").Strategy

router.use(passport.initialize())
router.use(passport.session())
router.use(flash())


passport.serializeUser(function(user, done) {   
    console.log("첫번째 시도")
    console.log(user[0].id)
    done(null, user[0].id);
});
passport.deserializeUser(function(id, done) {   
    console.log("재시도")
    var query="select * from user where id=?"
    connection.query(query,id,function(err,result){
        done(err,result[0].id)
    })
});
var connection=mysql.createConnection(options)
connection.connect()
passport.use(new LocalStrategy({
    usernameField:"id",
    passwordField:"password"
    },
    function(username,password,done){
        var query="select * from user where id=?"
        connection.query(query,username,function(err,result){
            if(err){
                console.log(err)
            }else{
                if(result.length>0){
                    if(password==result[0].password){
                        done(null,result)
                    }else{
                        done(null,false,{message:"비밀번호 오류"})
                    }
                }else{
                    done(null,false,{message:"존재하지 않는 계정"})
                }
            }
        })
    }
    ))
//로그인
router.get("/login",function(req,res){
    res.render(path.join(__dirname,"../views/index"),{"message": req.flash("error")})
})
router.post("/login",passport.authenticate("local",{
    failureRedirect:"/auth/login",failureFlash:true}),
    function(req,res){
        req.session.save(function(){
            console.log(req.body)
            res.render(path.join(__dirname,"../views/main"),{name:req.body.id,password:req.body.password})
        })
    }
)
//로그아웃
router.get("/logout",function(req,res){
    req.logout()
    req.session.save(function(){
        res.redirect("/")
    })
})
//회원가입
router.get("/register",function(req,res){
    res.render("../views/register")
})
router.post("/register",function(req,res){
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