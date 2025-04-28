//jshint esversion:6
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

const ConfigApp = require("../assets/config");
const General = require("../models/general");
const Section = require("../models/section");
const Element = require("../models/element");
const Menu = require("../modules/menu");
// const isAdmin = require("../modules/admin");


//main directory path
const { dirname } = require('path');
const element = require("../models/element");
const appDir = dirname(require.main.filename);

module.exports.set = function(app) {
  
    // ------------------------------------ H O M E -----------------------------

    app.get("/", async function(req, res){

        General.findOne({config : "app"}, async function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general); 
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/home");
            } else {
                //le menu data + general data
                let dataMenu = await Menu.getMenu();

                let app = await Menu.getApp();

                const date = new Date();
                const day = date.toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' });
                
                // console.log(general);
                res.render("site/pages/home3d", {general: general, menu: dataMenu, app: app, day: day});
            }
        }).populate({
            path: 'showcaseElements',
            model: 'Element',
            populate: {
                path: 'section',
                model: 'Section'
              } 
          });
    });










    // ------------------------------------ H O M E   3 D-----------------------------

    // app.get("/home3d", async function(req, res){
    //     General.findOne({config : "app"}, async function(err, general){
    //         if (!general) {
    //             //on créer la config de base du site
    //             const general = new General(ConfigApp.general); 
    //             general.save();
    //             //On redirige vers lui meme une fois la config créer
    //             res.redirect("/home");
    //         } else {
    //             //le menu data + general data
    //             let dataMenu = await Menu.getMenu();

    //             let app = await Menu.getApp();

    //             const date = new Date();
    //             const day = date.toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' });
                
    //             // console.log(general);
    //             res.render("site/pages/home3d", {general: general, menu: dataMenu, app: app, day: day});
    //         }
    //     }).populate({
    //         path: 'showcaseElements',
    //         model: 'Element',
    //         populate: {
    //             path: 'section',
    //             model: 'Section'
    //           } 
    //       });
    // });


    // ------------------------------------ MUSIC -----------------------------

    app.get("/music", async function(req, res){
        General.findOne({config : "app"}, async function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general); 
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/home");
            } else {
                //le menu data + general data
                let dataMenu = await Menu.getMenu();

                let app = await Menu.getApp();
                
                // console.log(general);
                res.render("site/pages/music", {general: general, menu: dataMenu, app: app});
            }
        }).populate({
            path: 'showcaseElements',
            model: 'Element',
            populate: {
                path: 'section',
                model: 'Section'
              } 
          });
    });


    // ------------------------------------ EPHESE PYRAMIDES -----------------------------

    // app.get("/ephese", async function(req, res){
    //     General.findOne({config : "app"}, async function(err, general){
    //         if (!general) {
    //             //on créer la config de base du site
    //             const general = new General(ConfigApp.general); 
    //             general.save();
    //             //On redirige vers lui meme une fois la config créer
    //             res.redirect("/home");
    //         } else {
    //             //le menu data + general data
    //             let dataMenu = await Menu.getMenu();

    //             let app = await Menu.getApp();
                
    //             // console.log(general);
    //             res.render("site/pages/ephese", {general: general, menu: dataMenu, app: app});
    //         }
    //     }).populate({
    //         path: 'showcaseElements',
    //         model: 'Element',
    //         populate: {
    //             path: 'section',
    //             model: 'Section'
    //           } 
    //       });
    // });


    // ------------------------------------ HOME PREZ -----------------------------

    app.get("/homeprez", async function(req, res){
        General.findOne({config : "app"}, async function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general); 
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/home");
            } else {
                //le menu data + general data
                let dataMenu = await Menu.getMenu();

                let app = await Menu.getApp();
                
                // console.log(general);
                res.render("site/pages/homeprez", {general: general, menu: dataMenu, app: app});
            }
        }).populate({
            path: 'showcaseElements',
            model: 'Element',
            populate: {
                path: 'section',
                model: 'Section'
              } 
          });
    });


    // ------------------------------------ HOME PREZ -----------------------------

    app.get("/visualizer", async function(req, res){
        General.findOne({config : "app"}, async function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general); 
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/home");
            } else {
                //le menu data + general data
                let dataMenu = await Menu.getMenu();

                let app = await Menu.getApp();
                
                // console.log(general);
                res.render("site/pages/visualizer", {general: general, menu: dataMenu, app: app});
            }
        }).populate({
            path: 'showcaseElements',
            model: 'Element',
            populate: {
                path: 'section',
                model: 'Section'
              } 
          });
    });




    // ------------------------------------ T U N N E L-----------------------------

    app.get("/tunnel", async function(req, res){
        General.findOne({config : "app"}, async function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general); 
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/home");
            } else {
                //le menu data + general data
                let dataMenu = await Menu.getMenu();
                // console.log(general);
                res.render("site/pages/tunnel", {general: general, menu: dataMenu});
            }
        }).populate({
            path: 'showcaseElements',
            model: 'Element',
            populate: {
                path: 'section',
                model: 'Section'
              } 
          });
    });












    ///////////////////////////////////Requests Targetting all SECTIONS////////////////////////

    app.route("/api/sections")

    .get(cors(), async function(req, res){
        let app = await Menu.getApp();
        res.send(app);
    });
  
  
    ////////////////////////////////Requests Targetting A Specific Article////////////////////////
  
  //   app.route("/api/articles/:articleName")
  
  //   .get(cors(), function(req, res){
  
  //     Article.findOne({title: req.params.articleName}, function(err, foundArticle){
  //       if (foundArticle) {
  //         foundArticle.image = req.protocol + "://" + req.headers.host + "/upload/" + foundArticle.image;
  //         res.send(foundArticle);
  //       } else {
  //         res.send("No articles matching that title was found.");
  //       }
  //     });
  //   });


















































    // ------------------------------------ S E C T I O N -----------------------------

    app.get("/:sectionUrl", async function(req, res){
        let sectionUrl = req.params.sectionUrl;

        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral();
        
        Section.findOne({url : sectionUrl}, function(err, section){
            if (!err && section) {
                if(section.visible == true){
                    //si c'est une landing page
                    if(section.type === "landing"){
                        res.render("site/sections/landing", {section: section, menu: dataMenu, general: dataGeneral});
                    } //on check si la boutique est ouverte
                    else if((section.type === "shop" && dataGeneral.eCommerce) || section.type != "shop"){
                        Element.find({sectionId : section._id}, function(err, elements){
                            if (!err && elements) {
                                
                                //On enleve les visibles
                                elements = elements.filter(e=>e.visible != false);

                                res.render("site/sections/index", {section: section, elements: elements, menu: dataMenu, general: dataGeneral});
                            }
                            else { 
                                res.redirect("/"); 
                            }
                        }).populate({
                            path: 'section',
                            model: 'Section'
                          }).sort({order: "desc"});
                    }
                    else{
                        res.redirect("/"); 
                    }
                    
                } else { 
                    // console.log("404 !");
                    res.redirect("/"); 
                }
            } else { 
                // console.log("404 !");
                res.redirect("/"); 
            }
        });
    });























    // ------------------------------------- E L E M E N T ---------------------------------------

    app.get("/:sectionUrl/:elementUrl", async function(req, res){
        let sectionUrl = req.params.sectionUrl;
        let elementUrl = req.params.elementUrl;

        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral(); 

        Section.findOne({url : sectionUrl}, function(err, section){
            if (!err && section) {
                
                if(section.visible == true){
                    // console.log("searching : " + elementUrl);
                    Element.findOne({url : elementUrl}, function(err, element){
                        // console.log(element);
                        if(!err && element){
                            // console.log("founded : " + element.title);
                            if(element.visible == true){
                                //les elements a SHOWCASE sauf celui qu'on affiche //_id: {$ne: element._id}
                                Element.aggregate([{ $match: { sectionId: section._id.toString(), visible: true } },{ $sample: { size: 10 } }], function(err, showcaseElements){
                                    
                                    //on enleve celui qui est affiché
                                    showcaseElements = showcaseElements.filter(e=>e.url != element.url);
                                    // showcaseElements = elements.filter(e=>e.section.title === element.sectionTitle);
                                    Element.populate(showcaseElements, {path: "section"}, function(err, result){
                                        res.render("site/elements/index", {section: section, element: element, menu: dataMenu, showcaseElements: result, general: dataGeneral});
                                    });
                                    
                                }).limit(9);
                            } else { 
                                res.redirect("/"); 
                            }
                        }
                        else { 
                            res.redirect("/"); 
                        }
                    }).populate({
                        path: 'comments.user',
                        model: 'User'
                      }).populate({
                        path: 'section',
                        model: 'Section'
                      });
                } else { 
                    res.redirect("/"); 
                }
            } else { 
                res.redirect("/"); 
            }
        });
    });





    
}
