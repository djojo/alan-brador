const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const User = require("../models/user");
const Order = require("../models/order");
const Menu = require("../modules/menu");
const auth = require("../modules/auth");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

module.exports.set = function(app) {



  //-------------- R E G I S T E R      U S E R      B A S I C ----------------
  app.get("/register", async (req, res) => {
    var isWebZine = await auth.isWebZine();
    var isECommerce = await auth.isECommerce();
    // console.log(isWebZine);
    // console.log(isECommerce);
    if(isWebZine || isECommerce){
      //le menu data + general data
      let dataMenu = await Menu.getMenu();
      let dataGeneral = await Menu.getGeneral();
      res.render("site/accounts/register", {menu: dataMenu, general: dataGeneral});
    } else{
      res.redirect("/");
    }
    
  });

  app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    let errors = [];

    if(!validator.isEmail(username)) {
        errors.push({
            param: 'email',
            msg: "Vous devez entrer une adresse email valide"
        });
    }
    if(validator.isEmpty(password)) {
        errors.push({
            param: 'password',
            msg: 'Vous devez choisir un mot de passe.'
        });
    }
    try {
        const emailExists = await User.countDocuments({ username: username });
        if(emailExists === 1) {
            errors.push({
                param: 'email',
                msg: 'Cette adresse mail est déjà utilisé... Mot de passe oublié ?'
            });
        }
    } catch(err) {
        res.redirect("accounts/register");
    }

    if(errors.length > 0) {

        req.flash("error", errors[0].msg);
        // res.redirect("/", { messages: req.flash('info') });
        res.redirect("/register");
    } else {

      //We create user
      var newUser = new User({
        username: username,
        email: username,
        role: "Basic"
      });
      User.register(newUser,req.body.password,function(err, user){
      		if(err){
            let messageForgotPassword = " Mot de passe oublié ?";
      			req.flash("error",err.message + messageForgotPassword);
      			res.redirect("/register");
      		} else {
      			passport.authenticate("local")(req,res,function(){
      				req.flash("success","Hi, Welcome to My Store!");
      				res.redirect("/");
      			});
      		}
    	});
    }
});




  //--------------------------- L O G I N    B A S I C -------------------------------------
  app.get("/login", async (req, res) => {
    var isWebZine = await auth.isWebZine();
    var isECommerce = await auth.isECommerce();
    if(isWebZine || isECommerce){
      if (req.isAuthenticated()){
        res.redirect("/admin");
      } else {
        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral();
        res.render("site/accounts/login", {menu: dataMenu, general: dataGeneral});
      }
    }  else{
      res.redirect("/");
    }
  });

  app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    let errors = [];
    if(!validator.isEmail(username)) {
        errors.push({
            param: 'email',
            msg: 'Invalid e-mail address.'
        });
    }
    if(validator.isEmpty(password)) {
        errors.push({
            param: 'password',
            msg: 'Password is a required field.'
        });
    }
    try {
        const emailExists = await User.countDocuments({ username: username });
        if(emailExists != 1) {
            errors.push({
                param: 'email',
                msg: 'E-mail address does not exist.'
            });
        }
    } catch(err) {
        res.redirect("accounts/login");
    }
    //On check les erreurs
    if(errors.length > 0) {
        req.flash("error", errors[0].msg);
        res.redirect("/login");
    } else {
      //We authenticate user
      let user = new User({username: username, password: password});

      req.login(user, function(err){

        if (err) {
          console.log(err);
          res.render("admin/accounts/login");
        } else {
          //On connnecte l'utilisateur
          passport.authenticate("local")(req, res, function(err){
            if(err){
              req.flash("error","Something went wrong: " + err);
              res.redirect("/login");
            }
            else{
              console.log(req.user.role)
              if(req.user.role == "Basic"){
                req.flash("success","Hi " + user.username + ", you are now connected");
                res.redirect("/home");
              }else if(req.user.role == "Admin") {
                req.flash("success","Hi " + user.username + ", you are now connected");
                res.redirect("/admin");
              }
            }
          });
        }
      });
    }
  }); 

  //--------------------------- L O G I N     A D M I N -------------------------------------
  app.get("/admin/login", async (req, res) => {
    console.log("Admin login");
    if (req.isAuthenticated()){
      res.redirect("/admin");
    } else {
      res.render("admin/accounts/login", new User({}));
    }
  });

  app.post("/admin/login", async (req, res, next) => {

    const { username, password } = req.body;
    let errors = [];

    if(!validator.isEmail(username)) {
        errors.push({
            param: 'email',
            msg: 'Invalid e-mail address.'
        });
    }
    if(validator.isEmpty(password)) {
        errors.push({
            param: 'password',
            msg: 'Password is a required field.'
        });
    }
    try {
        const emailExists = await User.countDocuments({ username: username });
        if(emailExists != 1) {
            errors.push({
                param: 'email',
                msg: 'E-mail address does not exist.'
            });
        }
    } catch(err) {
        res.redirect("accounts/login");
    }

    //On check les erreurs
    if(errors.length > 0) {
        req.flash("error", errors[0].msg);
        res.redirect("/login");
    } else {

      //We authenticate user
      let user = new User({username: username, password: password});

      req.login(user, function(err){

        if (err) {
          console.log(err);
          res.render("admin/accounts/login");
        } else {
          //On connnecte l'utilisateur
          passport.authenticate("local")(req, res, function(err){
            if(err){
              req.flash("error","Something went wrong: " + err);
              res.redirect("/login");
            }
            else{
              req.flash("success","Hi " + user.username + ", you are now connected");
              res.redirect("/admin");
            }
          });
        }
      });
    }
  }); 

  // --------------------------- A D M I N     R O U T E------------------------------------

  app.get("/admin", async (req, res) => {
    if (req.isAuthenticated()){
      if(req.user.role === "Admin"){
        res.render("admin/home");
      }else {
        res.redirect("/");
      }
    } else {
      res.redirect("/admin/login");
    }
      
  });

  //---------------------------- U S E R      P R O F I L E-----------------------
  app.get("/profile", auth.isBasic, async (req, res) => {
    //le menu data + general data
    let dataMenu = await Menu.getMenu();
    let dataGeneral = await Menu.getGeneral();
    console.log("User : " + req.user._id);
    //on cherche les commandes
    Order.find({user:req.user._id}, function (err, orders){
      console.log(orders);
      res.render("site/accounts/profile", {menu: dataMenu, general: dataGeneral, orders: orders});
    }).populate({
      path: 'checkoutCart.items',
      model: 'Element',
      populate: {
          path: 'section',
          model: 'Section'
        } 
    });;
    
  });

  app.post("/profile", auth.isBasic, async (req, res) => {
    //le menu data + general data
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.pseudo = req.body.pseudo;
    req.user.phone = req.body.phone;
    await req.user.save();
    req.flash("success", "Profil mis à jour ! ")
    res.redirect("profile");
  });


  //--------------------------- L O G O U T -------------------------------------

  app.get("/logout", async (req, res) => {
    req.logout();
    req.flash("success","Vous êtes déconnecté");
    res.redirect("/");
  });
}
