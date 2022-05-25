//jshint esversion:6

const http = require("http");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { dirname } = require('path');
request = require('request');
const appDir = dirname(require.main.filename);

const imgDictionnary = {
    'image/x-icon': 'ico',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/x-freehand': 'fh5',
    'image/jpeg': 'jpg',
    'image/tiff': 'tiff'
  };

module.exports = {
  addImages: addImages, 
  addImage: addImage,
  deleteFromArray: deleteFromArray,
  addBlankImage: addBlankImage
};

//upload l'image ou remplace l'image sur le serveur
//return le nom de l'image + extension à stocker dans la bdd
function addImages(req) {
    
    const files = req.files.sampleFile;
    let imgArray = [];
    for(let i = 0 ; i < files.length; i++){
      let imageId = uuidv4();
      let sampleFile = files[i];
      let extension = imgDictionnary[sampleFile.mimetype];
      let elementPath = imageId + "." + extension;

      //On copie l'image vers le dossier temporaire
      let uploadPath = appDir + '/public/temp/' + elementPath;
      sampleFile.mv(uploadPath, function(err) {
        if (err)
          console.log(err);
      });
      //on upload l'image vers l'api d'opimisation
      OptimiseImg(elementPath, req);

      //on push dans le tableau
      imgArray.push(elementPath);
    }
    return imgArray;
}

async function addImage(req) {
  //on supprime l'ancienne image du serveur si elle existe
  let path = appDir + '/public/upload/' + req.body.image;
  try {
    fs.unlinkSync(path);// file removed
  } catch(err) {
    console.error(err);
  }
  // sampleFile = input file name !!
  let sampleFile = req.files.sampleFile;
  let imageId = uuidv4();
  let extension = imgDictionnary[sampleFile.mimetype];
  let elementPath = imageId + "." + extension;

  //On copie l'image vers le dossier temporaire
  let uploadPath = appDir + '/public/temp/' + elementPath;
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      console.log(err);
  });

  //on upload l'image vers l'api d'opimisation
  // await OptimiseImg(elementPath);
  console.log("await ----------------------------");
  var fullUrl = req.protocol + '://' + req.get('host');
  console.log("URL SITE : "+ fullUrl);
  // var x = await resolveAfter2Seconds(10);
  // console.log(x); // 10
  var y = await OptimiseImg(elementPath, fullUrl);
  console.log("done ----------------------------" +y);
  return elementPath;
}

function addBlankImage(){

  //On va chercher l'image
  let noImgPath = appDir + '/public/img/no-img.png';
  let imageId = uuidv4();
  let elementPath = imageId + ".png";
  let uploadPath = appDir + '/public/upload/' + elementPath;
  fs.copyFile( noImgPath, uploadPath, function(err){
    if (err)
      console.log(err);
  });
  return elementPath;
}


function deleteFromArray(imageArray) {
  imageArray.forEach(function(image){
    let path = appDir + '/public/upload/' + image;
    try {
      fs.unlinkSync(path);
      //file removed
    } catch(err) {
      console.error(err);
    }
    console.log("Successfully deleted image from server !");
  });
}


function OptimiseImg(imageName, fullUrl){
  return new Promise(resolve => {
    // setTimeout(() => {
      // let imagePath = appDir + '/public/temp/' + imageName;
    console.log("Image Name : "+imageName);
    const baseUrl = "http://api.resmush.it/ws.php?img=";
    const imgAdress = fullUrl + "/temp/" + imageName;
    console.log("url site :"+fullUrl);
    const quality = "&qlty=95";
    console.log("img adress :"+imgAdress);
    var test = "https://geoffroyrouaix.herokuapp.com/upload/61e68fbe97f1240dea3f904b.jpg";
    const url = baseUrl+test+quality;
    console.log("url api optim : "+url);
    const options = {
      method: "POST"
    };
    const request = http.request(url, options, function(response){
      if(response.statusCode == 200){
        // return true;
      }
      response.on("data", function(data){
        // console.log(data);
        var newImg = JSON.parse(data);
        console.log(newImg);
        console.log("newImg.dest : "+ newImg.dest);

        let uploadPath = appDir + '/public/upload/' + imageName;

        download(newImg.dest, uploadPath, function(){
          console.log('Image downloaded !!');
          //on supprime l'image temp
          // let path = appDir + '/public/temp/' + imageName;
          // try {
          //   fs.unlinkSync(path);
          //   console.log('Image removed from temp/ !!');
          // } catch(err) {
          //   console.error(err);
          // }
          resolve(imageName);
        });
        
      });
    });
    // request.write(jsonData);
    request.end();


    
    // }, 2000);
  });
  
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

// OPTIMIZE IMAGES
