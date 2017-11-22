// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------



let THREE = require('./libs/three/three')
let TerrainGenerator = require('./terrain_generator')
// import THREEx from "./extensions/threex.fullscreen"

let clock = new THREE.Clock()

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
// camera.position.z = 60;

// Place camera on x axis
camera.position.set(30,40,60);
camera.up = new THREE.Vector3(0,1,0);
camera.lookAt(new THREE.Vector3(0,0,0));

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#33aadd");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

console.log(document)
// Append Renderer to DOM
document.body.appendChild( renderer.domElement );
// document.getElementById("myContainer").appendChild( renderer.domElement )
// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

let keysDown = {}


let onDocumentKeyDown = (event) => {
    keysDown[event.which] = true;  
    // console.log( event.which)
}

let onDocumentKeyUp = (event) => {
    keysDown[event.which] = false;  
}



addEventListener("keyup", onDocumentKeyUp, false);
addEventListener("keydown", onDocumentKeyDown, false);


// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );

// Add cube to Scene
//scene.add( cube );

TerrainGenerator.generateTerrain(scene);

let pos_offset = 0
let camera_offset = 500
let height_offset = 500

let cam_speed = 500

let prevSecond = 0
let framesThisSecond = 0

let forceFPS = 0 // 60 

if (forceFPS){
  setInterval(() => requestAnimationFrame(render), 1000/forceFPS)
}


// Render Loop
var render = () => {

  if (!forceFPS){
    requestAnimationFrame( render );
  }
  

  let delta = clock.getDelta()

  pos_offset = pos_offset + delta *  0.1

  let currentSecond = Math.round(clock.getElapsedTime())
  framesThisSecond++
  // console.log(time)
  if (currentSecond !== prevSecond){
    prevSecond = currentSecond
    console.log(`Second: ${currentSecond} FPS: ${framesThisSecond}`)
    framesThisSecond = 0
  }

  

  if (keysDown[87]) {
    camera_offset -= cam_speed * delta
  }
  if (keysDown[83]) {
    camera_offset += cam_speed * delta
  }
  if (keysDown[65]) {
    pos_offset += cam_speed * 0.005 * delta
  }
  if (keysDown[68]) {
    pos_offset -= cam_speed * 0.005 * delta
  }

  if (keysDown[69]) {
    height_offset += cam_speed * delta
  }
  if (keysDown[81]) {
    height_offset -= cam_speed * delta
  }


  camera.position.set(camera_offset * Math.cos(pos_offset), Math.sin(pos_offset) * 50 + height_offset, camera_offset * Math.sin(pos_offset));
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));




  // Render the scene
  renderer.render(scene, camera);
};


if (!forceFPS){
  render();
}
