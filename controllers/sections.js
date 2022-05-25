const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
//pour supprimer un fichier
const fs = require('fs');
const Section = require("../models/section");
const Element = require("../models/element");
const auth = require("../modules/auth");
const image = require("../modules/image");
 
//main directory path
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

module.exports.set = function(app) {


  //------------------------------------- A L L       S E C T I O N S ---------------------------------------
  app.get("/admin/sections", auth.isAdmin, function(req, res){
      Section.find({}, function(err, sections){
        if (sections.length === 0) {
          res.redirect("/admin/sections/create");
        } else {
          sections = sections.filter(e=>e.type != "landing");
          res.render("admin/sections/index", {listSections: sections});
        }
      }).sort({ order: 'asc'});
  }); 

  //------------------------------------- A L L       L A N D I N G     P A G E S ---------------------------------------
  app.get("/admin/landings", auth.isAdmin, function(req, res){
      Section.find({type : "landing"}, function(err, sections){
        if (sections.length === 0) {
          res.redirect("/admin/sections/create");
        } else {
          res.render("admin/landings/index", {listSections: sections});
        }
      }).sort({ order: 'asc'});
  }); 


  //--------------------------- A J A X     O R D E R     S E C T I O N S -----------------
  app.post("/admin/ordersections", auth.isAdmin, function(req, res){
      // console.log(req.body._id);
      var order = req.body.order;
      // console.log(order);
      order = order.replaceAll(/[&]/g,'');
      var sections = order.split('section[]=');
      sections.splice(0,1);
      // console.log(sections);

      sections.forEach(function (sectionId, index){
        Section.updateOne({_id: sectionId},{
          order: index}, 
            function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                console.log("Updated Order Sections !");
            }
        });

      });
  }); 








  //------------------------------------- C R E A T E      S E C T I O N S   +   D E T A I L S ---------------------
  
  app.get("/admin/sections/:sectionParam", auth.isAdmin, function(req, res){
      let param = req.params.sectionParam;
      // console.log(param);
      if(param === "create"){
        res.render("admin/sections/create");
      }
      else{
        Section.findOne({title: param}, function(err, section){
          // console.log(section);
          if (!section) {
            res.redirect("/admin/sections");
          } else {
            Element.find({sectionId: section._id}, function(err, elements){
                res.render("admin/sections/details", {section: section, listElements: elements});
            }).sort({ order: 'desc'});
            
          }
        });
      }
  });

  //post create
  app.post("/admin/sections/create", auth.isAdmin, async function(req, res){
      let errors = []; // le tableau des erreurs

      var visible = false;
      if(req.body.visible === "on"){
        visible = true;
      }

      //on met en lowercase le titre
      var title = req.body.title;
      title = title.toLowerCase();

      //on créer l'url
      var url = req.body.title;
      url = url.replaceAll(/[#{}^;/§°()!.,÷\?:%@&=+$`"'€*]/g,'');
      url = url.replaceAll(' ','-');
      url = url.replaceAll('à', 'a');
      url = url.replaceAll('é', 'e');
      url = url.replaceAll('è', 'e');
      url = url.replaceAll('ù', 'u');
      url = url.replaceAll('ç', 'c');
      url = url.toLowerCase();
      console.log(url);

      try {
        const sectionExists = await Section.countDocuments({ title: title });
        if(sectionExists >= 1) {
          console.log("Une section porte déjà ce nom !");
            errors.push({
                param: 'title',
                msg: 'Une section porte déjà ce nom !'
            });
        }
      } catch(err) {
          console.log(err);
      }

      

      let imageNewUrl = req.body.image;
      //l'image background
      try{
        if(req.files){
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

      //on rajoute l'ordre
      var order = 0;
      await Section.find({}, function (err, results) {
        order = results.length+2;
      });

      //on construit la section
      const section = new Section({
        title: title,
        order: order,
        url: url,
        description: req.body.description,
        type: req.body.type,
        image: imageNewUrl,
        visible: visible
      });

      //on save dans la bdd
      await section.save();

      console.log(section.type);

      if(section.type === "landing" || section.type === "page" || section.type === "about"){
        req.flash("success","La page " + req.body.title + " a été ajouté !");
        res.redirect("/admin/sections/edit/"+section._id);
      }
      else{
        req.flash("success","La section " + req.body.title + " a été ajouté !");
        res.redirect("/admin/sections/"+section.title);
      }
      
  });


























  //------------------------------------- E D I T       S E C T I O N S ---------------------------------------

  app.get("/admin/sections/edit/:sectionParam", auth.isAdmin, function(req, res){
      let sectionId = req.params.sectionParam;
      
      Section.findOne({_id: sectionId}, function(err, section){
        // console.log(section);
        if (!section) {
          res.redirect("/admin/sections");
        } else {
          res.render("admin/sections/edit", {section: section});
        }
      });
  });

  app.post("/admin/sections/edit", auth.isAdmin, async function(req, res){

    let errors = []; // le tableau des erreurs

      //visible checkbox
      var visible = false;
      if(req.body.visible === "on"){
        visible = true;
      }

      //on met en lowercase le titre
      var title = req.body.title.toLowerCase();

      //on créer l'url
      var url = req.body.title;
      url = url.replaceAll(/[#{}^;/§°()!.,÷\?:%@&=+$`"'€*]/g,'');
      url = url.replaceAll(' ','-');
      url = url.replaceAll('à', 'a');
      url = url.replaceAll('é', 'e');
      url = url.replaceAll('è', 'e');
      url = url.replaceAll('ù', 'u');
      url = url.replaceAll('ç', 'c');
      url = url.toLowerCase();
      console.log(url);

      // On regarde si le titre de la section existe déjà
      // Section.findOne({_id: req.body.sectionId}, function(err, section){
      //     if(section.title == title){
      //       console.log("meme titre car meme section !");
      //     }
      //     else{
      //       try {
      //         const sectionExists = Section.countDocuments({ title: title });
      //         if(sectionExists == 1) {
      //           console.log("meme titre sur une autre section !");
      //             errors.push({
      //                 param: 'title',
      //                 msg: 'Une section porte déjà ce nom !'
      //             });
      //         }
      //       } catch(err) {
      //           res.redirect("/admin/sections/edit/" + req.body.sectionId);
      //       }
      //     }
      // });

      

      // try{
      //   if(errors.length > 0) {
      //     req.flash("error", errors[0].msg);
      //     // res.redirect("/", { messages: req.flash('info') });
      //     res.redirect("/admin/sections/edit/" + req.body.sectionId);
      //   }
      // }
      // catch (err){
      //   console.log(err);
      // }

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
      

      //On récupère les images qui étaient déja présente qu'il faut supprimer
      console.log("Image to delete :" +req.body.imagesToDelete);
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
      
      //les images galerie
      // console.log(req.files);
      try{
        if(req.files){
          if(req.files.sampleFile){
            // console.log(req.files.sampleFile);
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
        }
      }
      catch (err){
        console.log(err);
      }
      

      let links;
      let youtubeObj;
      console.log("type de page : " + req.body.type);
      if(req.body.type == "page" || req.body.type === "about" || req.body.type === "landing"){

        //YOUTUBE LINKS
        const youtubelinks = req.body.youtube;
        youtubeObj = [];
        if(youtubelinks != ""){
          youtubeObj = youtubelinks.split(',');
        }

        // LES LINKS
        links = JSON.parse(req.body.socialLinks);
      }

      var revealDate;
      var revealData;
      if(req.body.type === "landing"){
        revealDate = req.body.revealDate;
        revealData = req.body.revealData;
      }


      Section.updateOne({_id: req.body.sectionId},{
        title: title, 
        url: url,
        description: req.body.description, 
        image: imageNewUrl,
        youtube: youtubeObj, 
        images: imagesArray, 
        webLinks: links,
        revealDate: revealDate,
        revealData: revealData,
        type: req.body.type, 
        visible: visible}, 
          function (err, docs) {
          if (err){
              console.log(err);
          }
          else{
              // console.log("Updated Docs : ", docs);
              req.flash("success","La section " + req.body.title + " a été modifié !");
              res.redirect("/admin/sections/" + req.body.title);
          }
      });
  });

























  //------------------------------------- D E L E T E      S E C T I O N  ---------------------------------------

  app.post("/admin/sections/delete", auth.isAdmin, function(req, res){
      const sectionId = req.body.sectionId;

      //on va chercher les elements
      Element.find({sectionId: sectionId}, function(err, elements){
        //on supprime chaque element
        elements.forEach(function(element){
          //On supprime les images du serveur
          image.deleteFromArray(element.images);
          //on supprime de l'élément de la bdd
          Element.findByIdAndRemove(element._id, function(err){
              if (!err) {
                console.log("Successfully deleted element : " + element._id);
              }
          })
        });
      });

      //on supprime la section
      Section.findOne({_id: sectionId}, function(err, section){
        if (!err){
          if (!section) {
            res.render("404");
          } else {
            //On supprime l'image du serveur
            let path = appDir + '/public/upload/' + section.image;
            try {
              fs.unlinkSync(path);
              //file removed
            } catch(err) {
              console.error(err);
            }
            //on supprime de la bdd
            Section.findByIdAndRemove(sectionId, function(err){
              if (!err) {
                console.log("Successfully deleted section : " + sectionId);
                req.flash("success","La section " + section.title + " a été supprimé !");
                res.redirect("/admin/sections");
              }
            });
          }
        }
      });
  });

  // A J A X
  // app.post("/admin/sections/visible", auth.isAdmin, function(req, res){
  //     console.log(req.body._id);
  //     console.log(req.body.state);
  //     Section.findOne({_id : req.body._id}, function(err, section){
          
  //       //UPDATE ONE FIELD !!!!!!
  //         // Section.updateOne({_id: req.body.sectionId}, 
  //         //     {title: title, description: req.body.description, image: imageNewUrl, type: req.body.type, visible: visible}, 
  //         //     function (err, docs) {
  //         //     if (err){
  //         //         console.log(err);
  //         //     }
  //         //     else{
  //         //         console.log("Updated Docs : ", docs);
  //         //         req.flash("success","La section " + req.body.title + " a été modifié !");
  //         //         res.redirect("/admin/sections/" + req.body.title);
  //         //     }
  //         // });
          
  //         res.status(200).send({ state: req.body.state });
  //     }).catch((err) => {
  //         res.status(400).send(err);
  //     });

  // }); 


}
