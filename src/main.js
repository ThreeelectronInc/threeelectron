// require('./apps/app.js');
// require('./apps/orbital.js');
// require("./apps/game_of_life")
// require('./apps/board_game')



let p5 = require('./libs/p5/0.5.14/p5')
require('./libs/p5/0.5.14/addons/p5.sound')
require('./libs/p5/0.5.14/addons/p5.dom')


// require('./apps/snake_game.js')





function setup(){
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

let texMarker, texCard
function preload(){
  texMarker = loadImage('assets/marker.png')
  texCard = loadImage('assets/card.png')
}

function draw(){

  scale(1,-1,1) // Flip y axis.  x is right, y is up, z is towards the camera

  let y = sin(frameCount * 0.01) * 100
  //move the camera away from the plane by a sin wave
  // TODO: look at
  // rotateX(0,radians(75))
  // camera(0, y, 100)//, 0, 0, 0, 0, 1, 0);
  camera(0, y, 100, 0, 0, 0, 0, 1, 0);
  console.log('camera y: ', y)


  fill(0,0,0,0) //hack to allow for transparent textures
  

  // var gl = this._renderer.GL;
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  

// push()
// identity()


// fill(0,0,0,0) //hack to allow for transparent textures


texture(texCard)
// fill(255,0,255);
stroke(0,255,0)

beginShape(TRIANGLE_STRIP);
vertex(-100, 0, 100);
vertex(-100, 0, -100);
vertex(100, 0, 100);
vertex(100, 0, -100);
endShape();
// pop()

texture(texMarker)
rotateZ(radians(180))
translate(0,0,0)
plane()

}

