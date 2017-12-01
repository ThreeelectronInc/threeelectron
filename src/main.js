

// TODO: try to get chunk generation to use this async sleep example
//          instead of setInterval hack
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function demo() {
    console.log('Taking a break...');
    await sleep(2000);
    console.log('Two second later');
  }
  
  demo();

// TODO: Move chunk generation into separate process thread like so
const worker = new Worker('./core/worker.js')

worker.onmessage = function(e) {
    // result.textContent = e.data;
    console.log('Message received from worker', e.data);
  }

  // NOTE: SharedArrayBuffer, which is used for 
  //    sharing memory between processes is only available in chromium 60+
  //    Will need to wait until electron upgrades from 58 to 60 before we can optimise using this.

// const length = 10;

// // Creating a shared buffer
// const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * length)

// // Creating a data structure on top of that shared memory area
// const sharedArray = new Int32Array(sharedBuffer)

// // Let's build an array with 10 even numbers
// for (let i = 0; i < length; i++) sharedArray[i] = i && sharedArray[i - 1] + 2

// // Send memory area to our worker
// worker.postMessage(sharedBuffer)

// setTimeout(function() {
//     console.log('[MASTER] Change triggered.')
//     sharedArray[0] = 1337
// }, 5000)


let {SurvivalGame} = require('./modules/survival')

// Second argument allows forcing FPS.  Warning: this is buggy if machine cannot keep up
// let game = new SurvivalGame('myContainer', 120)
let game = new SurvivalGame('myContainer')//, 120)

game.start()
