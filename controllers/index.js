//jshint esversion:6
var account = require('./account.js');
var sections = require('./sections.js');
var elements = require('./elements.js');
var contact = require('./contact.js');
var comments = require('./comments.js');
var cart = require('./cart.js');
var home = require('./home.js');
var general = require('./general.js');


module.exports.set = function(app) {

  

  //ACCOUNT
  account.set(app);

  //SECTIONS
  sections.set(app);

  //ELEMENTS
  elements.set(app);

  //CONTACT
  contact.set(app);

  //CART
  cart.set(app);

  //GENERAL
  general.set(app);
  
  //COMMENTS
  comments.set(app);

  //HOME SITE
  home.set(app);

  //The 404 Route (ALWAYS Keep this as the last route)
    // app.get('*', function(req, res){
    //     General.findOne({config : "app"}, function(err, general){
    //         if (!general) {
    //             //on créer la config de base du site
    //             const general = new General({
    //                 config: "app",
    //                 contactMail: "contact@monsite.com",
    //                 socialLinks: ["instagram.com", "facebook.com"],
    //                 bio: "Ma super bio, je me présente...",
    //                 homeMessage: "Bienvenue sur mon site",
    //                 error404Message: "Erreur, cette page n'existe pas..."
    //             }); 
    //             general.save();
    //             //On redirige vers lui meme une fois la config créer
    //             res.redirect("/admin/home");
    //         } else {
    //             res.status(404).render('404', {general: general});
    //         }
    //     });
    // });

}
