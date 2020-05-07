const express = require('express');
const session = require("express-session");
const passport = require("./passport");
const mongoose = require("mongoose");

const db = require("./user");

const app = express();

app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.post("/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });


app.post("/register",(req,res)=>{
    console.log("you sent"+req.body);
    db.create(req.body, function (err, small) {
        if (err) return handleError(err);
        // saved!
        console.log("created!");
      });
})

app.get("*",(req,res)=>{
    if(req.user){
        res.send("authenticated!");
        
    }
    else{
        res.redirect("/loginform.html");
    }

})
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/passport-user-test");
app.listen(5000,()=>{console.log("started!")})