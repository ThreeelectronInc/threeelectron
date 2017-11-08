// function setup() {
    
//     var myCanvas = createCanvas(600, 400);
//     myCanvas.parent('myContainer');

//     drawingContext.shadowOffsetX = 5;
//     drawingContext.shadowOffsetY = -5;
//     drawingContext.shadowBlur = 10;
//     drawingContext.shadowColor = "black";
//     background(200);
//     ellipse(width/2, height/2, 50, 50);
//   }
  
//   function draw() {
//     if (mouseIsPressed) {
//       fill(0);
//     } else {
//       fill(255);
//     }
//     ellipse(mouseX, mouseY, 80, 80);
//   }




// function setup(){
//     createCanvas(710, 400, WEBGL);
//   }
  
//   function draw(){
//     background(250);
    
//     translate(-240, -100, 0);
//     normalMaterial();
//     push();
//     rotateZ(frameCount * 0.01);
//     rotateX(frameCount * 0.01);
//     rotateY(frameCount * 0.01);
//     plane(70);
//     pop();
    
//     translate(240, 0, 0);
//     push();
//     rotateZ(frameCount * 0.01);
//     rotateX(frameCount * 0.01);
//     rotateY(frameCount * 0.01);
//     box(70, 70, 70);
//     pop();
    
//     translate(240, 0, 0);
//     push();
//     rotateZ(frameCount * 0.01);
//     rotateX(frameCount * 0.01);
//     rotateY(frameCount * 0.01);
//     cylinder(70, 70);
//     pop();
    
//     translate(-240 * 2, 200, 0);
//     push();
//     rotateZ(frameCount * 0.01);
//     rotateX(frameCount * 0.01);
//     rotateY(frameCount * 0.01);
//     cone(70, 70);
//     pop();
    
//     translate(240, 0, 0);
//     push();
//     rotateZ(frameCount * 0.01);
//     rotateX(frameCount * 0.01);
//     rotateY(frameCount * 0.01);
//     torus(70, 20);
//     pop();
    
//     translate(240, 0, 0);
//     push();
//     rotateZ(frameCount * 0.01);
//     rotateX(frameCount * 0.01);
//     rotateY(frameCount * 0.01);
//     sphere(70);
//     pop();
//   }



// function setup(){
//     createCanvas(710, 400, WEBGL);
//   }
  
//   function draw(){
//     background(250);
//     rotateY(frameCount * 0.01);
  
//     for(var j = 0; j < 5; j++){
//       push();
//       for(var i = 0; i < 80; i++){
//         translate(sin(frameCount * 0.001 + j) * 100, sin(frameCount * 0.001 + j) * 100, i * 0.1);
//         rotateZ(frameCount * 0.002);
//         push();
//         sphere(8, 6, 4); 
//         pop();
//       }
//       pop();
//     }
//   }





// function setup(){
//     createCanvas(710, 400, WEBGL);
//   }
  
//   function draw(){
//     background(0,255,0);
  
//     var locY = (mouseY / height - 0.5) * (-2);
//     var locX = (mouseX / width - 0.5) * 2;
  
//     ambientLight(50);
//     directionalLight(200, 0, 0, 0.25, 0.25, 0.25);
//     pointLight(0, 0, 200, locX, locY, 0);
//     pointLight(200, 200, 0, -locX, -locY, 0);
  
//     push();
//     translate(-250, 0, 0);
//     rotateZ(frameCount * 0.02);
//     rotateX(frameCount * 0.02);
//     specularMaterial(250);
//     box(100, 100, 100);
//     pop();
  
//     translate(250, 0, 0);
//     ambientMaterial(250);
//     sphere(120, 64);
//   }




function setup(){
  createCanvas(710, 400, WEBGL);
}

function draw(){
  background(250);
  var radius = width * 1.5;
  
  //drag to move the world.
  orbitControl();

  normalMaterial();
  translate(0, 0, -600);
  for(var i = 0; i <= 12; i++){
    for(var j = 0; j <= 12; j++){
      push();
      var a = j/12 * PI;
      var b = i/12 * PI;
      translate(sin(2 * a) * radius * sin(b), cos(b) * radius / 2 , cos(2 * a) * radius * sin(b));    
      if(j%2 === 0){
        cone(30, 30);
      }else{
        box(30, 30, 30);
      }
      pop();
    }
  }
}