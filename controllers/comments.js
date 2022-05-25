//jshint esversion:6
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const ConfigApp = require("../assets/config");
const General = require("../models/general");
const Section = require("../models/section");
const Element = require("../models/element");
const User = require("../models/user");
const Menu = require("../modules/menu");
const auth = require("../modules/auth");


//main directory path
const { dirname } = require('path');
const element = require("../models/element");
const appDir = dirname(require.main.filename);

module.exports.set = function(app) {

    // ---------------- A D D  C O M M E N T ------------------
    app.post("/comment/add", auth.isBasic ,function(req,res){
        var comment = {
            content: req.body.content,
            user: req.user._id
        }
        console.log("add comment: " + comment);
        console.log(req.body.elementId);

        Element.findById(req.body.elementId, async function(err,element){
            // console.log(element);
            // element.comments = [comment];
            element.comments.unshift(comment);
            element.save();
            Section.findById(element.sectionId, async function(err,section){
                req.flash("error","Commentaire posté !");
                res.redirect("/"+section.url+'/'+element.url );
            });
        });
    });

    // ---------------- R E M O V E    C O M M E N T ------------------
    app.get("/comment/remove/:elementId", auth.isBasic, async function(req,res){
        
        // console.log(req.params.elementId);

        //on var chercher le produit
        await Element.findOne({_id : req.params.elementId}, async function(err,element) {
            if(err) {
                req.flash("error","Something went wrong!!");
                res.redirect("/cart");
            } else {
                await User.findOne({_id : req.user._id},function(err,user) {
                    if(err) {
                        req.flash("error","Something went wrong !!");
                        res.redirect("/cart");
                    } else {
                        console.log("User found: " + user.username);
                        for (var i = user.cart.items.length - 1; i >= 0; i--) {
                            if(user.cart.items[i].element._id.equals(req.params.elementId)) {
                                // user.cart.cart_total-=(product.mrp*user.cart.items[i].qty);
                                // user.cart.discount-=(product.discount*user.cart.items[i].qty);
                                user.cart.total-=(element.price);
                                user.cart.items.splice(i,1);
                                break;
                            }
                        }
                        user.save();
                    }
                });
            }
        });

        req.flash("success","Product removed from Cart !");
        res.redirect("/cart");
    });
    
}
