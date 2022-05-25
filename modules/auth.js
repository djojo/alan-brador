//jshint esversion:6

const General = require("../models/general");

module.exports = {
    isAdmin: isAdmin, 
    isBasic: isBasic,
    isECommerce: isECommerce,
    isWebZine: isWebZine
};


function isAdmin(req,res,next) {
    if (req.isAuthenticated()){
      if(req.user.role === "Admin") {
        next();
      } 
      else {
        req.flash("error","Permission Denied!!");
        res.redirect("/");
      }
    } else {
    req.flash("error","Login to continue!!");
    res.redirect("/login");
    }
}

function isBasic(req,res,next) {
    if (req.isAuthenticated()){
      if(req.user.role === "Basic" || req.user.role === "Admin") {
        next();
      } 
      else {
        req.flash("error","Permission Denied!!");
        res.redirect("/");
      }
    } else {
    req.flash("error","Login to continue!!");
    res.redirect("/login");
    }
}

function isECommerce(req,res,next) {
  return new Promise(resolve => {
    General.findOne({config : "app"}, function(err, general){
        // return ;
        resolve(general.eCommerce);
    }); 
  });
}

function isWebZine(req,res,next) {
  return new Promise(resolve => {
    General.findOne({config : "app"}, function(err, general){
        // return ;
        resolve(general.webZine);
    }); 
  });
}