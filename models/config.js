var express=require("express")
var app=express()
var mysql=require("mysql")

var option = {
    host: "localhost",
    port: 3306,
    user : "root",
    password : "P@ssw0rd",
    database : "blog"
};
module.exports=option

