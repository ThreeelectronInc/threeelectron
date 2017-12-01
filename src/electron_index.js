const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// For hot reloading of changes
// require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  // win = new BrowserWindow({width: 800, height: 600, webPreferences: { experimentalFeatures: true } })
  // win = new BrowserWindow({ experimentalFeatures: true })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  let dev_mode = true

  if (dev_mode){
    // Open the DevTools.
    win.webContents.openDevTools()

  }
  else{
    win.setMenu(null)
  }



  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// let fetch = require('fetch')
// let testFunc = async () => await fetch('www.google.com').then(out => console.log('woot', out))
// let testFunc = () => console.log('woot')
// testFunc()
// require('./apps/app.js')
// import './apps/app.js'

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
console.log("TODO: Backend goes here")

/*

const worker = new Worker('./../core/worker.js')
const length = 10;

// Creating a shared buffer
const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * length)

// Creating a data structure on top of that shared memory area
const sharedArray = new Int32Array(sharedBuffer)

// Let's build an array with 10 even numbers
for (let i = 0; i < length; i++) sharedArray[i] = i && sharedArray[i - 1] + 2

// Send memory area to our worker
worker.postMessage(sharedBuffer)

setTimeout(function() {
    console.log('[MASTER] Change triggered.')
    sharedArray[0] = 1337
}, 5000)

*/



const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})