// import './style.css';
// import * as THREE from '../three';
// import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);



//le model 3d car
let car;
let loader = new THREE.GLTFLoader();
loader.load('3d/car/scene.gltf', function(gltf){
  car = gltf.scene.children[0];
  car.scale.set(0.01,0.01,0.01);
  scene.add(gltf.scene);
  car.position.z = 100;
  car.position.setX(-20);
  car.position.setY(0);
  car.rotation.z = 1;
  // animate();
});

//le model 3d face hero
let face;
let loaderFace = new THREE.GLTFLoader();
loaderFace.load('3d/cryptodealer.gltf', function(gltf){
  face = gltf.scene.children[0];
  // face.scale.set(1,1,1);
  scene.add(gltf.scene);
  face.position.z = 40;
  face.position.setX(-5);
  face.position.setY(-3);
  face.rotation.y = 1.7;
  // animate();
});



//Les etoiles
let starGeo = new THREE.Geometry();
for(let i=0;i<6000;i++) {
  let star = new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  );
  star.velocity = 0;
  star.acceleration = 0.0002;
  starGeo.vertices.push(star);
}

let sprite = new THREE.TextureLoader().load( 'img/elgeogeo.png' );
let starMaterial = new THREE.PointsMaterial({
  // color: 0xaaaaaa,
  // size: 1.6,
  size: 1,
  map: sprite
});

let stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);




// function addStar() {
//   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
//   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
//   const star = new THREE.Mesh(geometry, material);
//
//   // const [x, y, z] = Array(3)
//   //   .fill()
//   //   .map(() => THREE.MathUtils.randFloatSpread(100));
//
//   const [x, y, z] = [Math.random() * (-50), Math.random() * -50, Math.random() * -50];
//
//
//   // alert(x + " " + y + " " + z);
//
//   star.position.set(x, y, z);
//   star.acceleration = 0.0002;
//   scene.add(star);
// }
// Array(200).fill().forEach(addStar);





window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


// Torus

const geometry = new THREE.TorusGeometry(10, 2, 6, 6);
const material = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
// const torus = new THREE.Mesh(geometry, material);
const torus = new THREE.Mesh(geometry);

torus.position.z = -7;
torus.position.x = 0;

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 1;
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);



// Background

const spaceTexture = new THREE.TextureLoader().load('img/backgroundlanding.jpeg');
scene.background = spaceTexture;

// ELGEOGEO

const geoTexture = new THREE.TextureLoader().load('img/elgeogeo.png');

const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: geoTexture }));

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('img/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('img/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);



//TERRE
const earthTexture = new THREE.TextureLoader().load('img/earth.jpeg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(15, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);

scene.add(earth);

earth.position.z = 60;
earth.position.setX(-30);

jeff.position.z = -7;
jeff.position.x = 0;
// jeff.position.y = 1;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  moon.rotation.y += 0.0075;
  // moon.rotation.z += 0.05;

  // earth.rotation.x += 0.005;
  earth.rotation.y += 0.0075;
  // earth.rotation.z += 0.05;

  // jeff.rotation.y += 0.02;
  // jeff.rotation.z += 0.01;

  // face.rotation.y += 0.001;



  stars.rotation.y +=0.02;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

var lastScrollTop = 0;
$(window).scroll(function(event){
  var st = $(this).scrollTop();
  // console.log(st);
  if (st > lastScrollTop){
    console.log("down" + st);
    jeff.rotation.y += 0.02;
    // car.rotation.z -= 0.0015;
    if(st > 9140){
      // car.position.x += 0.2;

    }
      // downscroll code

      // alert("down");
  } else {
    console.log("up" + st);
    jeff.rotation.y -= 0.02;
    // car.rotation.z += 0.0015;
    // upscroll code
    // alert("up");
    if(st > 9140){

      // car.position.x -= 1.2;

    }

  }
  lastScrollTop = st;
});

$(document).ready(function(){
  moveCamera();
});


// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  earth.rotation.y += 0.005;



  // controls.update();

  starGeo.vertices.forEach(p => {
    p.velocity += p.acceleration
    p.y -= p.velocity;

    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  starGeo.verticesNeedUpdate = true;
  stars.rotation.y +=0.002;


  renderer.render(scene, camera);
}

animate();
