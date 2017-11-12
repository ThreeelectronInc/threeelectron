// function setup() {

// }

// function draw() {
//     ellipse(50, 50, 80, 80);
// }

// import a static p5 version
let p5 = require('./../libs/p5/0.5.14/p5')

let $ = require('./../libs/jquery-3.2.1')

let fetch = async (url) => {

    let data

    await $.get(url)
        .then(res => {data = res})

    console.log(data)
}


// Using p5 in instance mode.
//  This is an alternative to letting it populate the global scope
// /*
let sketch = ( p ) =>  {


    let x = 100; 
    let y = 100;

    let timePrevious = 0;

    let delta = 0;


    fetch('http://www.google.com')

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);

        // p.noLoop() // disable draw loop
        p.frameRate(60) // configure draw loop
    }

    p.draw = () => {


        let timeCurrent = p.millis()

        delta = timeCurrent - timePrevious;
        // console.log(delta)
        timePrevious = timeCurrent  

        p.background(0);
        p.fill(255);

        y = y - delta * 0.25; 
        if (y < 0) { 
          y = p.height; 
        } 

        p.rect(x,y,50,50);
    }


    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)        
    }
    p.mousePressed = () => {
        p.redraw(); 
    }
}

let myp5 = new p5(sketch, 'myContainer');
