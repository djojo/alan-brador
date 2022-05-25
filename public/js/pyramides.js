//Reload to generate new one

//import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { SVG, Color } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import gsap from "https://cdn.skypack.dev/gsap@3.9.1";
import "https://cdn.skypack.dev/@svgdotjs/svg.filter.js@3.0.8";




const imgs = ["https://cdn.pixabay.com/photo/2019/03/29/15/05/landscape-4089375_1280.jpg",
             "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg", 
             "https://cdn.pixabay.com/photo/2013/04/04/12/34/mountains-100367_1280.jpg",
             "https://assets.codepen.io/1385231/goldpaper.jpg"
]

let draw, colors, colorPalette, moonSize;
let images = [];

const backgroundTexture = "https://assets.codepen.io/1385231/goldpaper.jpg";
const moonTexture = "https://assets.codepen.io/1385231/moonpaper2.jpg";
const textures = [
  "https://assets.codepen.io/1385231/bluepaper.jpg",
  "https://assets.codepen.io/1385231/whitepaper.jpg",
  "https://assets.codepen.io/1385231/graypaper.jpg",
  "https://assets.codepen.io/1385231/plasterpaper.jpg"
];

var size = window.innerWidth;
const sizes = [0*size, size/4, size/2, (size/4), size];


//play with this
var polygonComplexity = randomIntFromInterval(3,10);





function CreateSquare(){ 
  var color = colors[Math.floor(Math.random() * colors.length)];
  var draw = SVG().addTo('#pochette'), rect = draw.rect(size/2, size/2).fill(color);
}

var width = window.innerWidth;
var height = $("#pochette").height();
const xLength = [0, width/8, width/7, width/6, width/5, width/4, width/3, width/2, width];
const yLength = [height/2, height/3, height/4, height*0.6, height*0.7];

const xPoints = [0, 150, 300, 180, 230];
 
function generatePyramide(basePoint, endPoint){
  var pyramideGenerated = ""; 
  //premier Point
    pyramideGenerated += xLength[randomIntFromInterval(0,xLength.length)];
    pyramideGenerated += "," + height + " ";
  //for(var i=0; i<3; i++){
    pyramideGenerated += xLength[randomIntFromInterval(0,3)];
    pyramideGenerated += ",";  
    pyramideGenerated += yLength[randomIntFromInterval(0,3)];
  
  pyramideGenerated += " "+xLength[randomIntFromInterval(0,xLength.length)]+"," + height;
  //dernier point
  //}
  //pyramideGenerated = "-100,400 200,0 400,400";
  return pyramideGenerated;
} 

function createPyramide(){
  
  var draw = SVG().addTo('#pochette').size(size, size);
  var polygon = draw.polygon(generatePyramide());
  polygon.fill(imgs[randomIntFromInterval(0,imgs.length)]);
  polygon.css({ "opacity": "0.7" });
}
function drawBackground() {
  const bgMask = draw.rect(100, 100).attr({ fill: "#777" });
  var bgTexture = draw.image(backgroundTexture).maskWith(bgMask);
  draw
    .rect(100, 100)
    .attr({ fill: colorPalette[0] })
    .css({ "mix-blend-mode": "color" });

  var gradient = draw
    .gradient("linear", function (add) {
      add.stop(0, "#333");
      add.stop(1, "#fff");
    })
    .from(0, 0)
    .to(0, 1);

  draw
    .rect(100, 100)
    .fill(gradient)
    .opacity(0.7)
    .css({ "mix-blend-mode": "overlay" });
}

function Main(){
  
  //CreateSquare();
  for(var j=0; j<8; j++){
    createPyramide();
    //CreatePolygon();
  }
}

Main();




function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}



              
