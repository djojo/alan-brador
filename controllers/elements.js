//jshint esversion:6
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
//pour supprimer un fichier
const fs = require('fs');
// fs = require('fs-extra');

const Section = require("../models/section");
const Element = require("../models/element");
const auth = require("../modules/auth");
const image = require("../modules/image");

// const imgDictionnary = {
//   'image/x-icon': 'ico',
//   'image/png': 'png',
//   'image/gif': 'gif',
//   'image/bmp': 'bmp',
//   'image/x-freehand': 'fh5',
//   'image/jpeg': 'jpg',
//   'image/tiff': 'tiff'
// };

//main directory path
const { dirname } = require('path');
const element = require("../models/element");
const appDir = dirname(require.main.filename);

module.exports.set = function(app) {

  //--------------------------- A J A X     O R D E R     E L E M E N T S -----------------
  app.post("/admin/orderelements", auth.isAdmin, function(req, res){
    // console.log(req.body._id);
    var order = req.body.order;
    console.log(order);
    order = order.replace(/[&]/g,'');
    var elements = order.split('element[]=');
    elements.splice(0,1);
    // console.log(sections);

    elements.forEach(function (elementId, index){
      console.log(elementId + " : " + index);
      var newOrder = elements.length - index;
      console.log(newOrder);
      Element.updateOne({_id: elementId},{
        order: newOrder}, 
          function (err, docs) {
          if (err){
              console.log(err);
          }
          else{
              console.log("Updated Order Element !");
          }
      });

    });
}); 
  

  //--------------------------- C R E A T E       E L E M E N T -----------------
  app.get("/admin/elements/create/:sectionId", auth.isAdmin, function(req, res){
      let param = req.params.sectionId;
      
      Section.findOne({_id: param}, function(err, section){
        if (!section) {
          res.redirect("/admin/sections");
        } else {
          res.render("admin/elements/create", {section: section});
        }
      });
  });

  app.post("/admin/elements/create", auth.isAdmin, async function(req, res){

      //visible checkbox
      var visible = false;
      if(req.body.visible === "on"){
        visible = true;
      }
      var imgArray = []; 

      //on créer l'url
      var url = req.body.title;
      url = url.replace(/[#{}^;/§°()!.,÷\?:%@&=+$`"'€*]/g,'');
      url = url.replace(/' /g,'-');
      url = url.replace(/à/g, 'a');
      url = url.replace(/é/g, 'e');
      url = url.replace(/è/g, 'e');
      url = url.replace(/ù/g, 'u');
      url = url.replace(/ç/g, 'c');
      url = url.toLowerCase();
      console.log(url);
      
      //les images
      if(req.files){
        if(req.files.sampleFile.length){
          //On upload les images et ça nous return le chemin à sauvegarder
          console.log("ajout de plusieurs images");
          newImgArray = await image.addImages(req);
          imgArray = newImgArray;
        }
        else{
          //sinon il n'y a qu'une image 
          console.log("ajout d'une image");
          var newImg = await image.addImage(req);
          imgArray.push(newImg);
          //on upload l'image vers l'api d'opimisation
          // console.log("await ----------------------------");
          // var fullUrl = req.protocol + '://' + req.get('host');
          // console.log("URL SITE : "+ fullUrl);
          // var optimise = await image.optimiseImg(newImg, fullUrl);
          // console.log("done ----------------------------" + optimise);
        }
      }
      
      //si il n'y pas de prix
      var price = req.body.price;
      if(!price){
        price = 0;
      }
      console.log("Price : " + price);

      //si il n'y pas de nombre de copie
      var nbCopy = req.body.nbCopy;
      if(!nbCopy){
        nbCopy = 0;
      }
      console.log("nbCopy : " + nbCopy);

      //Les tags
      const tags = req.body.tags;
      var tagsArray = [];
      if(tags){
        tagsArray = tags.split(',');
      }
      console.log("tags : " +tagsArray);

      //on rajoute l'ordre
      var order = 0;
      await Element.find({sectionId: req.body.sectionId}, function (err, results) {
        order = results.length+2;
      });

      // on construit l'objet
      const element = new Element({
        title: req.body.title,
        url: url,
        order: order,
        legend: req.body.legend,
        tags: tagsArray,
        description: req.body.description,
        section: req.body.sectionId,
        sectionTitle: req.body.sectionTitle,
        sectionUrl: req.body.sectionUrl,
        sectionId: req.body.sectionId,
        price: price,
        nbCopy: nbCopy,
        visible: visible,
        images: imgArray,
        date: req.body.date,
        adress: req.body.adress,
      });
      //on save dans la bdd
      await element.save();

      //on ajoute l'élément à la section
      Section.findById(req.body.sectionId, async function(err,section){
        console.log(section);
        section.elements.unshift(element);
        await section.save();

        // req.flash("success","L'élement " + req.body.title + " a été ajouté à " + req.body.sectionTitle + " !");
        res.redirect("/admin/elements/edit/" + element._id);
        
      });

      
    
  });

















  //--------------------------- E D I T       E L E M E N T -----------------
  //modifier un element
  app.get("/admin/elements/edit/:elementParam", auth.isAdmin, function(req, res){
      let elementId = req.params.elementParam;
      Element.findOne({_id: elementId}, function(err, element){
        if (!element) {
          res.redirect("/admin/sections");
        } else {
          Section.findOne({_id: element.sectionId}, function(err, section){
            res.render("admin/elements/edit", {element: element, section: section});
          });
        }
      }); 
  });

  app.post("/admin/elements/edit", auth.isAdmin, async function(req, res){

      //visible checkbox
      var visible = false;
      if(req.body.visible === "on"){
        visible = true;
      }

      //on recréer l'url
      var url = req.body.title;
      url = url.replace(/[#{}^;/§°()!.,÷\?:%@&=+$`"'€*]/g,'');
      url = url.replace(/' /g,'-');
      url = url.replace(/à/g, 'a');
      url = url.replace(/é/g, 'e');
      url = url.replace(/è/g, 'e');
      url = url.replace(/ù/g, 'u');
      url = url.replace(/ç/g, 'c');
      url = url.toLowerCase();
      console.log(url);

      //On récupère les images qui étaient déja présente qu'il faut supprimer
      if(req.body.imagesToDelete){
        let imagesToDeleteArray = req.body.imagesToDelete.split(',');
        //On les supprime du server
        image.deleteFromArray(imagesToDeleteArray); 
      }

      //On récupère les images qui étaient déja présente qu'il faut garder si il y en a
      let imagesArray = [];
      if(req.body.images){
        imagesArray = req.body.images.split(',');
      }
      
      //les images
      if(req.files){
        if(req.files.sampleFile.length){
          //On upload les images et ça nous return le chemin à sauvegarder et on les rajoutes au tableau
          newImgArray = await image.addImages(req);
          imgArray = newImgArray;
          imagesArray = [...imagesArray, ...newImgArray];
        } 
        else{
          //sinon il n'y a qu'une image 
          var newImg = await image.addImage(req);
          imagesArray.push(newImg);
          //on upload l'image vers l'api d'opimisation
          // console.log("await ----------------------------");
          // var fullUrl = req.protocol + '://' + req.get('host');
          // console.log("URL SITE : "+ fullUrl);
          // var optimise = await image.optimiseImg(newImg, fullUrl);
          // console.log("done ----------------------------" + optimise);
        }
      } 

      //Les liens Youtube
      const youtubelinks = req.body.youtube;
      var youtubeObj = [];
      if(youtubelinks != ""){
        youtubeObj = youtubelinks.split(',');
      }

      //Les tags
      const tags = req.body.tags;
      var tagsArray = [];
      if(tags){
        tagsArray = tags.split(',');
      } 

      //le content de l'article
      var articleContent;
      if(req.body.articleContent){
        articleContent = JSON.parse(req.body.articleContent);
        console.log("articleContent : " + articleContent);
      }

      //On update
      await Element.updateOne(
        {_id: req.body.elementId},{
          title: req.body.title, 
          url: url,
          legend: req.body.legend, 
          tags: tagsArray,
          description: req.body.description, 
          articleContent: articleContent,
          date: req.body.date, 
          adress: req.body.adress, 
          price: req.body.price, 
          nbCopy: req.body.nbCopy, 
          youtube: youtubeObj, 
          images: imagesArray, 
          type: req.body.type, 
          visible: visible, 
          section: req.body.sectionId,
          sectionId: req.body.sectionId, 
          sectionUrl: req.body.sectionUrl,
          sectionTitle: req.body.sectionTitle},
        function(err){
          if(!err){
              req.flash("success","L'élement " + req.body.title + " a été modifié !");
              res.redirect("/admin/sections/"+ req.body.sectionTitle );
          }
        }
      );
  });

  













   //--------------------------- D E L E T E       E L E M E N T -----------------
  app.post("/admin/elements/delete", auth.isAdmin, function(req, res){
    const elementId = req.body.elementId;

    //on supprime la section
    Element.findOne({_id: elementId}, function(err, element){
      if (!err){
        if (!element) {
          res.render("404");
        } else {
          //On supprime les images du serveur
          image.deleteFromArray(element.images);
          //on supprime de la bdd
          Element.findByIdAndRemove(elementId, function(err){
            if (!err) {
              Section.findOne({_id: req.body.sectionId}, async function(err, section){
                  //On supprime l'element de la section
                  section.elements = section.elements.filter(function(ele){ 
                    return ele != elementId; 
                  });
                  await section.save();
                  console.log("Successfully deleted element : " + elementId);
                  req.flash("success","L'élement " + element.title + " a été supprimé !");
                  res.redirect("/admin/sections/"+ section.title );
              });
            }
          });
        }
      }
    });
  });

}