

// import a static p5 version
let p5 = require('./../libs/p5/0.5.14/p5')

let sketch = ( p ) =>  {
    
        let x = 100; 
        let y = 100;
    
        let lastTime = 0;
    
        let delta = 0;
    
    
        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    
            // p.noLoop() // disable draw loop
            p.frameRate(60) // configure draw loop
        }
    
        p.draw = () => {
    
    
            delta = p.millis() - lastTime;
            // console.log(delta)
            lastTime = p.millis();  
    
            p.background(250);
            let radius = p.width * 1.5;
            
            //drag to move the world.
            // p.orbitControl(); // This method is not really done.  Write your own.
            
            if(p.mouseIsPressed){
                p.rotateY((p.mouseX - p.width / 2) / (p.width / 2));
                p.rotateX((p.mouseY - p.height / 2) / (p.width / 2));
            }
          
            p.normalMaterial();
            p.translate(0, 0, -600);
            for(let i = 0; i <= 12; i++){
              for(let j = 0; j <= 12; j++){
                p.push();
                let a = j/12 * p.PI;
                let b = i/12 * p.PI;
                p.translate(p.sin(2 * a) * radius * p.sin(b), p.cos(b) * radius / 2 , p.cos(2 * a) * radius * p.sin(b));    
                if(j%2 === 0){
                  p.cone(30, 30);
                }else{
                  p.box(30, 30, 30);
                }
                p.pop();
              }
            }
        }
    

        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight)        
        }
    
    }
    
    let myp5 = new p5(sketch, 'myContainer');
    