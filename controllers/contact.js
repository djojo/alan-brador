
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const subscribeMailChimp = require("../modules/mailchimp");

const Message = require("../models/message");
const sendMail = require("../modules/mail");
const Menu = require("../modules/menu");


module.exports.set = function(app) {

  app.get("/contact", async function(req, res){
    //le menu data + general data
    let dataMenu = await Menu.getMenu();
    let dataGeneral = await Menu.getGeneral();
    res.render("site/pages/contact", {menu: dataMenu, general: dataGeneral});
  });

  app.post("/contact", function (req, res){

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const content = req.body.content;
    const phone = req.body.phone;

    //on enregistre dans la bdd le message
    const message = new Message({
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phone,
      content: content,
      seen: false
    });
    message.save();

    //MAIL CHIMP
    subscribeMailChimp(email, firstName, lastName);

    //on construit le mail
    let html = "<div>";
    html += "<div style='font-weight: bold; text-align: center; padding: 50px 0px; font-size: 1.5em;'>Message de "+ firstName + " " + lastName + ":</div>";
    if(content) {
      html += "<div style='padding: 20px;margin-bottom:20px; border: 2px dotted #333;'>" + content + "</div>";
    }
    if(email) {
      html += "<div style='text-align: center; padding: 10px 0px; font-size: 1.5em;'>Mail: " + email + "</div>";
    }
    if(phone) {
      html += "<div style='text-align: center; padding: 10px 0px; font-size: 1.5em;'>Tel: " + phone + "</div>";
    }
    html += "</div>";

    //on construit le texte
    let text = content;

    let subject = "Nouveau Message sur ton portfolio !! 👻";

    let title = "Portfolio Geoffroy Rouaix";

    //On envoi un mail à elgeogeo
    sendMail(html, text, subject, process.env.SMTP_HOST_MAIL, title);
    req.flash("success", res.locals.lang.flashMessageSent);
    res.redirect("/");
  });

  ///////////////////// ADMIN/////////////////
  app.get("/admin/messages", function(req, res){
    console.log("messages")
    if (req.isAuthenticated()){
      Message.find({}, function(err, messages){
        res.render("admin/messages/index", {listMessages: messages});
      }).sort({ date: 'desc'});
    } else {
      res.render("admin/accounts/login");
    }
  });

  app.post("/admin/message/delete", function(req, res){
    if (req.isAuthenticated()){
      const messageId = req.body.messageId;
      //on supprime de la bdd
      Message.findByIdAndRemove(messageId, function(err){
        if (!err) {
          // console.log("Successfully deleted checked item.");
          res.redirect("/admin/messages");
        }
      });
    } else {
      res.render("login");
    }
  });

}
