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
const Order = require("../models/order");
const Menu = require("../modules/menu");
const auth = require("../modules/auth");


//main directory path
const { dirname } = require('path');
const element = require("../models/element");
const appDir = dirname(require.main.filename);

module.exports.set = function(app) {

    // ---------------- C A R T ------------------
    app.get("/cart", auth.isBasic, async function(req,res){
        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral();

        var isECommerce = await auth.isECommerce();
        //on check si le panier est visible
        if(isECommerce){
            User.findById(req.user._id).populate("cart.items.element").exec( function(err,user){
                if(err || !user) {
                    req.flash("error","Something went wrong!!");
                    res.redirect("/");
                } else {
                    res.render("site/cart/index",{user: user, menu: dataMenu, general: dataGeneral});
                }
            });
        }
        else{
            res.redirect("/");
        }
    });



















    // -------------------------------------------- C H E C K     O U T ----------------------------------------------

    app.get("/checkout", auth.isBasic, async function(req,res){
        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral();

        var isECommerce = await auth.isECommerce();
        //on check si le panier est visible
        if(isECommerce){
            //On check si l'utilisateur a quelque chose dans le panier
            if(req.user.cart.items.length>0){
                User.findById(req.user._id).populate("cart.items.element").exec( function(err,user){
                    if(err || !user) {
                        req.flash("error","Something went wrong!!");
                        res.redirect("/");
                    } else {
                        res.render("site/cart/checkout",{user: user, menu: dataMenu, general: dataGeneral});
                    }
                });
            } else{
                res.redirect("/cart");
            }
        } else{
            res.redirect("/");
        }
    });

    app.post("/checkout", auth.isBasic, async function(req,res){
        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral();

        //on check si le panier est visible
        var isECommerce = await auth.isECommerce();
        if(isECommerce){

            await User.findById(req.user._id).populate("cart.items.element").exec( async function(err,user){});
            const newOrder = new Order({
                // no: "NUM ORDER",
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                address: {
                    address: req.body.address,
                    city: req.body.city,
                    country: req.body.country,
                    zipCode: req.body.zipCode
                },
                checkoutCart: {
                    items: [],
                    cart_total: req.user.cart.cart_total,
                    discount: req.user.cart.discount,
                    total: req.user.cart.total
                },
                user: req.user
            });
            //populate l'order
            req.user.cart.items.forEach(function(cartItem){
                newOrder.checkoutCart.items.push(cartItem.element._id);
            });

            console.log("Order checkout items after: ");
            console.log(newOrder.checkoutCart.items);
            //On sauvegarde la commande
            await newOrder.save();

            //on update les elements
            console.log("On met à jour le nombre de copies restantes.");
            req.user.cart.items.forEach(function(cartItem){
                Element.findOne({_id: cartItem.element._id}, async function(err, element){
                    if(!err && element){
                        element.nbCopy = element.nbCopy-1;
                        await element.save();
                    }
                });
            });

            console.log("Success, add to user now");
            req.user.orders.unshift(newOrder);
            req.user.cart.items.splice(0,req.user.cart.items.length);
            req.user.cart.cart_total=0;
            req.user.cart.discount=0;
            req.user.cart.total=0;
            await req.user.save();

            req.flash("success","Order placed successfully!!")
            res.redirect("/confirmation/"+newOrder._id);
            
        } else{
            res.redirect("/");
        }
    });
















    // -------------------------------------------- C O N F I R M A T I O N --------------------------------

    app.get("/confirmation/:orderId", auth.isBasic, async function(req,res){

        //le menu data + general data
        let dataMenu = await Menu.getMenu();
        let dataGeneral = await Menu.getGeneral();

        //on check si le panier est visible
        var isECommerce = await auth.isECommerce();
        if(isECommerce){

            Order.findOne({ _id: req.params.orderId}, function(err,order){
                if(err || !order) {
                    req.flash("error","Something went wrong!!");
                    res.redirect("/");
                } else {
                    console.log(order);
                    res.render("site/cart/confirmation",{order: order, menu: dataMenu, general: dataGeneral});
                }
            }).populate({
                path: 'checkoutCart.items',
                model: 'Element'
              });
        } 
        else{
            res.redirect("/");
        }
    });























    // -------------------------------------- A D D    I N    C A R T --------------------------------

    app.get("/cart/new/:elementId/:sectionUrl/:return",inCart, auth.isBasic ,function(req,res){
        var cartItem = {
            element: req.params.elementId,
            qty: 1
        }
        req.user.cart.items.unshift(cartItem);
        console.log("add to cart");
        console.log(req.params.sectionTitle);
        Element.findById(req.params.elementId, async function(err,element){
            if(err || !element) {
                console.log("Product not found!!");
                req.flash("error","Product not found!!");
                res.redirect("/" + req.params.sectionUrl);
            } else {
                
                // req.user.cart.cart_total+=element.mrp;
                // req.user.cart.discount+=element.discount;

                //on met a jour le panier
                // req.user.cart.cart_total+=(element.price*user.cart.items[i].qty);
                // req.user.cart.discount+=(element.discount*user.cart.items[i].qty);
                // req.user.cart.total+=(element.total*user.cart.items[i].qty);
                req.user.cart.total+=element.price;
                await req.user.save();
                console.log("Cart updated !");

                req.flash("success","Product added to Cart !");

                if(req.params.return=="element") {
                    res.redirect("/" + req.params.sectionUrl + "/" + element.url);
                } else {
                    res.redirect("/" + req.params.sectionUrl);
                }
            }
        });
    });

    // ---------------- R E M O V E    F R O M     C A R T ------------------
    app.get("/cart/remove/:elementId",inCart, auth.isBasic, async function(req,res){
        
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

    function inCart(req,res,next) {
        if(req.isAuthenticated()) {
            if(req.user.cart.items.some(function(cartItem){
                return cartItem.element._id.equals(req.params.id);
            })) {
                req.flash("error","This product is already present in your cart!!");
                res.redirect("/products");
            } else {
                next();
            }
        } else {
            req.flash("error","Login to continue!!");
            res.redirect("/login");
        }
    }
}
