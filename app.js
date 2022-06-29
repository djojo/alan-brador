#!/usr/bin/env node
//jshint esversion:6
const express = require("express");
const app = express(); //on initialise express js
var bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose"); //BDD

const cors = require('cors');
app.use(cors());


//SESSION
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

var methodOverride = require("method-override");//pour la classe user
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
const LANGS = require("./assets/langs"); //Les textes du site
var flash = require("connect-flash"); // Les messages d'erreurs
// const path = require('path');
var $ = require('jquery');

const dotenv = require('dotenv');
dotenv.config();

app.set("view engine","ejs");

//main directory path
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
app.use(express.static(appDir + '/public'));



app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat',
	saveUninitialized: false
}));

// app.use(require("express-session")({
// 	secret: "abd",
// 	resave: false,
// 	saveUninitialized: false
// }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// la langue du site
const supportedLangs = ['EN', 'FR', 'ES'];
browserLang = "FR";

app.use(methodOverride("_method"));
//Les messages d'erreurs avec Flash
app.use(flash());

app.use(require("express-session")({
	secret: "abd",
	resave: false,
	saveUninitialized: false
}));

app.use(function(req,res,next){
	// Langues
	// res.locals.langs = Langs[LANGUAGE];
	res.locals.lang = LANGS.langs[browserLang];
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// default options
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));







//On définit le path des controllers
var controllers = require(appDir +'/controllers');
controllers.set(app);

//Connection à la base de donnee mongoDB
mongoose.connect("mongodb+srv://"+process.env.DB_LOGIN+":"+process.env.DB_PASSWORD+"@cluster0.c1cnw.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);





//-------------------S E R V E R------------------------
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000.");
});
