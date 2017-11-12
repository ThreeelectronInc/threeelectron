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
function draw(){

  let y = sin(frameCount * 0.01) * 300
 //move the camera away from the plane by a sin wave
 camera(0, y, 100, 0, 0, 0, 0, 1, 0);

console.log(y)

// push()
// background(0);
// // fill(255, 0, 0);
// noStroke();

// rotateX(radians(90))
// fill(204);
// triangle(18, 18, 18, 360, 81, 360);

// fill(102);
// rect(81, 81, 63, 63);

// fill(204);
// quad(189, 18, 216, 18, 216, 360, 144, 360);

// fill(255);
// ellipse(252, 144, 72, 72);

// fill(204);
// triangle(288, 18, 351, 360, 288, 360); 

// // fill(255);
// // arc(479, 300, 280, 280, PI, TWO_PI);

// pop()

// push()


// noFill();
// beginShape();
// vertex(30, 20);
// vertex(85, 20);
// vertex(85, 75);
// vertex(30, 75);
// endShape(CLOSE);
background(255)
// fill(255,0,255);
stroke(0,255,0)
// beginShape(TRIANGLES);
// vertex(30, 75,0);
// vertex(40, 20,0);
// vertex(50, 75,0);
// vertex(60, 20,0);
// vertex(70, 75,0);
// vertex(80, 20,0);
// endShape();


// translate(0,20,0)
// beginShape(TRIANGLES);
// fill(255, 0, 0);
// noStroke();
// vertex(100,0,-100);
// vertex(-100,0,-100);
// vertex(-100, 0,100);
// // vertex(100, 0,100);
// // vertex(100,0,-100);
// endShape();
// pop()


// beginShape(TRIANGLE_FAN);
// vertex(57.5, 50);
// vertex(57.5, 15);
// vertex(92, 50);
// vertex(57.5, 85);
// vertex(22, 50);
// vertex(57.5, 15);
// endShape();

beginShape(TRIANGLE_STRIP);
vertex(-100, 0, 100);
vertex(-100, 0, -100);
vertex(100, 0, 100);
vertex(100, 0, -100);
endShape();


// background(250);
// rotateY(frameCount * 0.01);

// for(var j = 0; j < 5; j++){
//   push();
//   for(var i = 0; i < 80; i++){
//     translate(sin(frameCount * 0.001 + j) * 100, sin(frameCount * 0.001 + j) * 100, i * 0.1);
//     rotateZ(frameCount * 0.002);
//     push();
//     sphere(8, 6, 4); 
//     pop();
//   }
//   pop();
// }

}

/* Ellipse
function setup() {}

function draw() {
    ellipse(50, 50, 80, 80);
}
*/


/* Pie Chart

var angles = [ 30, 10, 45, 35, 60, 38, 75, 67 ];

function setup() {
  createCanvas(720, 400);
  noStroke();
  noLoop();  // Run once and stop
}

function draw() {
  background(100);
  pieChart(300, angles);
}

function pieChart(diameter, data) {
  var lastAngle = 0;
  for (var i = 0; i < data.length; i++) {
    var gray = map(i, 0, data.length, 0, 255);
    fill(gray);
    arc(width/2, height/2, diameter, diameter, lastAngle, lastAngle+radians(angles[i]));
    lastAngle += radians(angles[i]);
  }
}
*/

/* Bezier
function setup() {
    // createCanvas(720, 400);
    createCanvas(window.innerWidth, window.innerHeight);
    stroke(255);
    noFill();
  }
  
  function draw() {
    background(0);
    for (var i = 0; i < 200; i += 20) {
      bezier(mouseX-(i/2.0), 40+i, 410, 20, 440, 300, 240-(i/16.0), 300+(i/8.0));
    }
  }
  */



/* 3D Primitives
function setup() {
	createCanvas(710, 400, WEBGL);
}

function draw() {
	background(100);
	noStroke();

	push();
	translate(-300, 200);
	rotateY(1.25);
	rotateX(-0.9);
	box(100);
	pop();

	noFill();
	stroke(255);
	push();
	translate(500, height*0.35, -200);
	sphere(300);
	pop();
}
*/








