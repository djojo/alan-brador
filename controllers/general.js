//jshint esversion:6
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const ConfigApp = require("../assets/config");
const General = require("../models/general");
const Element = require("../models/element");
const auth = require("../modules/auth");
const image = require("../modules/image");


//main directory path
const { dirname } = require('path');
const element = require("../models/element");
const appDir = dirname(require.main.filename);

module.exports.set = function(app) {

    //--------------------------- A D M I N    H O M E ------------------
    
    app.get("/admin/home", auth.isAdmin, function(req, res){
        General.findOne({config : "app"}, function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general);
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/admin/home");
            } else {
                Element.find({}, function(err, elements){
                    if (!err && elements) {
                        res.render("admin/home/index", {general: general, elements: elements});
                    }
                    else { 
                        res.redirect("/"); 
                    }
                });
            }
        });
    }); 


    app.post("/admin/home", auth.isAdmin, function(req, res){
        console.log(req.body.homeMessage);
        
        General.updateOne({config : "app"}, 
            {homeMessage : req.body.homeMessage}, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Docs : ", docs);
            }
        });
        
        req.flash("success","Le message d'accueil a été modifié !");
        res.redirect("/admin");
    }); 
  














    //------------------------------ A D M I N     E D I T       G E N E R A L ------------------

    app.get("/admin/general", auth.isAdmin, function(req, res){
        General.findOne({config : "app"}, function(err, general){
            if (!general) {
                //on créer la config de base du site
                const general = new General(ConfigApp.general); 
                general.save();
                //On redirige vers lui meme une fois la config créer
                res.redirect("/admin/general");
            } else {
                res.render("admin/general/index", {general: general});
            }
        });
    }); 

    app.post("/admin/general", auth.isAdmin, async function(req, res){
        

        //ECOMMERCE
        var eCommerce = false;
        if(req.body.eCommerce === "on"){
            eCommerce = true;
        }
        //WEBZINE
        var webZine = false;
        if(req.body.webZine === "on"){
            webZine = true;
        }
        var contactVisible = false;
        if(req.body.contactVisible === "on"){
            contactVisible = true;
        }
        var aboutVisible = false;
        if(req.body.aboutVisible === "on"){
            aboutVisible = true;
        }

        //l'image background
        let imageNewUrl = req.body.actualBackgroundImage;
        console.log("Image background : " +imageNewUrl);
        if(req.body.deleteBackgroundImage ==  "yes"){
            console.log("on supprime l'image");
            image.deleteFromArray([imageNewUrl]);
            imageNewUrl = "";
        }
        try{
            if(req.files){
                console.log("Il y a un background de theme à uploader !");
                //Si il y a une image on upload l'image et ça nous return le nouveau chemin à sauvegarder
                if (req.files.backgroundImage) {
                    var newBackground = await image.addBackground(req);
                    imageNewUrl = newBackground;
                    //on upload l'image vers l'api d'opimisation
                    // console.log("await ----------------------------");
                    // var fullUrl = req.protocol + '://' + req.get('host');
                    // console.log("URL SITE : "+ fullUrl);
                    // var optimise = await image.optimiseImg(newImg, fullUrl);
                    // console.log("done ----------------------------" + optimise);
                }
            }
        } catch(err){
            console.log(err);
        }

        let links = JSON.parse(req.body.socialLinks);
        
        General.updateOne({config : "app"}, 
            {bio : req.body.bio, webZine: webZine, eCommerce: eCommerce, backgroundImage: imageNewUrl, contactVisible: contactVisible, aboutVisible: aboutVisible, socialLinks: links, contactMail: req.body.contactMail, error404Message: req.body.error404Message}, function (err, docs) {
            if (err){
                console.log(err)
            }
        });
        
        req.flash("success","Les informations générales ont été modifié !");
        res.redirect("/admin");
    }); 





















    // //------------------------------ A D M I N    S H O W C A S E ------------------
    // app.get("/admin/showcase", auth.isAdmin, function(req, res){
    //     General.findOne({config : "app"}, function(err, general){
    //         if (!general) {
    //             //on créer la config de base du site
    //             const general = new General(ConfigApp.general);
    //             general.save();
    //             //On redirige vers lui meme une fois la config créer
    //             res.redirect("/admin/showcase");
    //         } else {
    //             // res.render("admin/showcase/index", {general: general});
    //             Element.find({}, function(err, elements){
    //                 if (!err && elements) {
    //                     res.render("admin/showcase/index", {general: general, elements: elements});
    //                 }
    //                 else { 
    //                     res.redirect("/"); 
    //                 }
    //             });
    //         }
    //     });
    // }); 

     //--------------------------- A J A X      S H O W C A S E     E L E M E N T S -----------------
    app.post("/admin/showcase", auth.isAdmin, function(req, res){
        // console.log(req.body._id);
        var showId = req.body._id;
        General.findOne({config : "app"}, function(err, general){
            if (general) {
                var show = true;
                if( general.showcaseElements.indexOf(showId) == -1 ){
                    console.log("On ajoute au showcase elements ");
                    general.showcaseElements.push(showId);
                } else{
                    console.log("On enleve des showcase elements ");
                    general.showcaseElements = general.showcaseElements.filter(function(ele){ 
                        return ele != showId; 
                    });
                    show = false;
                }
                general.save();
                res.status(200).send({ _id: showId, show: show });
            }
        }).catch((err) => {
            res.status(400).send(err);
        });

    }); 
    
    

}
