//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
// const encrypt = require("mongoose-encryption");
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();


app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

// const secret = process.env.SECRET;
//
// userSchema.plugin(encrypt , {secret : secret , encryptedFields : ['password']});

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});


app.get("/register",function(req,res){
  res.render("register");
});


app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

  const newUser = new User({
    email : req.body.username,
    password : hash
      });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("secrets");
      }

  });
});
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email : username } , function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {   // yaha woh password without becrypt ly raha ha usse becrypt wo automatically khud kry ga rounds check krky aur phr database mi hash hue wy password se match krta rhy ga
    if(result === true){
      res.render("secrets");
    }
    else{
      res.send("<script> alert('Incorrect Password') </script>");
    }
    });

      }
    }
  });
});





app.listen(3000,function(){
  console.log("Server is Started on Port 3000");
});
