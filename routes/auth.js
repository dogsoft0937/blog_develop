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
    secret:"mdkawl&*^&ga41212wmlk",
    resave:false,
    saveUninitialized:true,
    store:sessionstore
}))
var passport=require("passport")
  , LocalStrategy = require("passport-local").Strategy

router.use(passport.initialize())
router.use(passport.session())
router.use(flash())

var connection=mysql.createPool(options)

//로그인 passport
passport.use("local-signin",new LocalStrategy({
    usernameField:"id",
    passwordField:"password",
    passReqToCallback:true
    },function(req,username,password,done){
        var query="select * from user where id=?"
        connection.query(query,username,function(err,result){
            if(err){
                console.log(err)
            }else{
                if(result.length>0){
                    if(password==result[0].password){
                        done(null,result)
                    }else{
                        done(null,false,req.flash("signinMessage","비밀번호 오류"))
                    }
                }else{
                    done(null,false,req.flash("signinMessage","계정이 존재하지 않음"))
                }
            }
})
}
))
// 회원가입 passport
passport.use("local-signup",new LocalStrategy({
    usernameField:"id",
    passwordField:"password",
    passReqToCallback:true
    },
    function(req,username,password,done){
        var nick=req.body.name
        var query="select * from user where id=?"
        connection.query(query,username,function(err,result){
            if(err){
                console.log(err)
            }else{
                if(result.length==0){
                    var insertquery="insert into user(name,id,password) values(?,?,?)"
                    var data=[nick,username,password]
                    connection.query(insertquery,data,function(error,result){
                        if(error){
                            console.log(error)
                        }else{
                            done(null,result)
                        }
                    })
                }else{
                    done(null,false,req.flash("signupMessage","존재하는 계정입니다."))
                }
            }
        })
    }
))
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null,user)
});  

//로그인 passport


//로그인
router.get("/login",function(req,res){
    if(!req.user){
    res.render(path.join(__dirname,"../views/login"),{message:req.flash("signinMessage")})
    }else{
        res.redirect("/auth/main")
    }
})
router.post("/login",passport.authenticate("local-signin",{
    failureRedirect:"/auth/login",
    failureFlash:true,
    successRedirect:'/auth/main'
    })
)

//회원가입
router.get("/register",function(req,res){
    if(req.user){
        res.render(path.join(__dirname,"../views/register"),{message: req.flash("signupMessage")})
    }else{
        res.redirect("/auth/main")
    }
})
router.post("/register",passport.authenticate("local-signup",{
    failureRedirect:"/auth/register",
    failureFlash:true,
    successRedirect:'/auth/login'
    })
)

//메인 페이지
router.get("/main",function(req,res){
    if(!req.user){
        res.redirect("/auth/login")
        return;
    }
    if(Array.isArray(req.user)){
        res.render(path.join(__dirname,"../views/main"),{user:req.user[0]})
    }else{
        res.render(path.join(__dirname,"../views/main"),{user:req.user})
    }
})
//로그아웃

router.get("/logout",function(req,res){
    req.logout()
    res.redirect("/")  
})

//글쓰기
router.get("/write",function(req,res){
    if(!req.user){
        res.redirect("/auth/login")
        return;
    }else{
    res.render(path.join(__dirname,"../views/write"))
    }
})
router.post("/write",function(req,res){
    console.log(req.user[0].name)
    console.log(req.user[0].id)
    console.log(req.user[0].password)
    console.log(req.body.title)
    console.log(req.body.story)
})

module.exports=router