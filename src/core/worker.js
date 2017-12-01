// self.addEventListener('message', (m) => {
//     // Create an Int32Array on top of that shared memory area
//     const sharedArray = new Int32Array(m.data)

//     console.log('[WORKER] Received SharedArrayBuffer. First value is: ' + sharedArray[0])

//     setTimeout(() => console.log('[WORKER] First value is now: ' + sharedArray[0]), 10000)
// });


var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();