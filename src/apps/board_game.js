
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


    // fetch('http://www.google.com')

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);

        // p.noLoop() // disable draw loop
        p.frameRate(60) // configure draw loop
    }

    p.draw = () => {


        let timeCurrent = p.millis()

        delta = timeCurrent - timePrevious;
        // console.log(delta)
        timePrevious = timeCurrent  

        p.background(0,255,0);
        p.fill(255);

        y = y - delta * 0.25; 
        if (y < 0) { 
          y = p.height; 
        } 

        p.rect(x,y,50,50);

          // for (let gamepad in gamepads){
          //   let gp = gamepads[gamepad]
          //   if (gp.buttons){

          //     console.log(gp.buttons[4].pressed)
          //   // console.log(gamepads[gamepad].buttons[1].pressed)
          //   // console.log("Gamepad connected at index " + gp.index + ": " + gp.id +
          //   // ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");

          //   }
          // // gameLoop();
          // // clearInterval(interval);
    
          // }

    // var gp = navigator.getGamepads()[0];
    // var left = (gp.axes[0] + 1) / 2 * (window.innerWidth - ball.offsetWidth);
    // var right = (gp.axes[1] + 1) / 2 * (window.innerHeight - ball.offsetHeight);
    //     console.log(left, right)
    // ball.style.left = left + "px";
    // ball.style.top =  right + "px";
    }


    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)        
    }
    p.mousePressed = () => {
        p.redraw(); 
    }
}


let Gamepad = require('./../libs/gamepad')

// console.log(gp)
const gamepad = new Gamepad();

gamepad.on('connect', e => {
    console.log(`controller ${e.index} connected!`);
});

gamepad.on('disconnect', e => {
    console.log(`controller ${e.index} disconnected!`);
});

gamepad.on('press', 'button_1', () => {
    console.log('button 1 was pressed!');
});

gamepad.on('hold', 'button_1', () => {
  console.log('button 1 is being held!');
});
gamepad.on('release', 'button_1', () => {
    console.log('button 1 was released!');
});


let myp5 = new p5(sketch, 'myContainer');
