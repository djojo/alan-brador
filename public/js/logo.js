//import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";

//const colors = ["#3498db", "#9b59b6", "#e67e22", "#1abc9c", "#e74c3c", "#34495e"];
const colors = ["#e58e26","#eb2f06", "#1e3799", "#82ccdd"];
//const sizes = [0*size, size/4, size/2, (size/4)*3, size];
// const sizes = [0*size, size/8, size/4, size/2, (size/4)*3, size];

//play with this
//var polygonComplexity = randomIntFromInterval(3,10);
var polygonComplexity = randomIntFromInterval(3,10);

function GeneratePolygone(sizes){
  var polygonGenerated = "";
  for(var i=0; i<polygonComplexity; i++){
    polygonGenerated += sizes[randomIntFromInterval(0,3)];
    polygonGenerated += ",";
    polygonGenerated += sizes[randomIntFromInterval(0,3)];
    polygonGenerated += " ";
  }
  return polygonGenerated;
}

function CreatePolygon(id, size){

  const sizes = [0*size, size/8, size/4, size/2, (size/4)*3, size];

  var color = colors[Math.floor(Math.random() * colors.length)];
  var draw = SVG().addTo(id).size(size, size);
  var polygon = draw.polygon(GeneratePolygone(sizes));
  polygon.fill(color);
}

function CreateSquare(id, size){
  var color = colors[Math.floor(Math.random() * colors.length)];
    //alert(id + "oui" + size);
  var draw = SVG().addTo(id), rect = draw.rect(size/2, size/2).fill("#30336b");
}






function CreatePochette(id, size){
  CreateSquare(id, size);
  for(var j=0; j<20; j++){
    NewPolygon(id, size);
  }
}


function NewPolygon(id, size){
    CreatePolygon(id, size);
}




function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
