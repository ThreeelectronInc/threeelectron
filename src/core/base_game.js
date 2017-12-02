let THREE = require('./../libs/three/three')

class BaseGame {
    constructor(tagName, fps = 0) {


        // Assert that required methods have been overridden
        if (this.init === undefined) { throw new TypeError("Must override method: init()") }
        if (this.deInit === undefined) { throw new TypeError("Must override method: deInit()") }
        if (this.update === undefined) { throw new TypeError("Must override method: update(delta)") }
        // if (this.handeInput === undefined) { throw new TypeError("Must override method: handleInput(delta)") }

        this._clear()

        this.tagName = tagName

        // Create an empty scene
        this.scene = new THREE.Scene();

        this.prevSecond = 0
        this.framesThisSecond = 0

        this.forceFPS = fps // 0 // 60 

        if (this.forceFPS) {
            this.updateFunction = setInterval(() => requestAnimationFrame(this.bound_update), 1000 / this.forceFPS)
        }

    }

    // private init
    _init() {

        this.parentDiv = document.getElementById(this.tagName)

        this.clock = new THREE.Clock()


        // Create a basic perspective camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
        // camera.position.z = 60;

        // Place camera on x axis
        this.camera.position.set(0, 0, 1);
        this.camera.up = new THREE.Vector3(0, 1, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // console.log(cam)

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        // Configure renderer clear color
        this.renderer.setClearColor("#33aadd");

        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Configure renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.autoClear = false; // To allow render overlay on top of sprited sphere

        // Add ThreeJS DOM element to existing element
        this.thisCanvas = this.parentDiv.appendChild(this.renderer.domElement)

        // Setup resize callback
        this.bound_onWindowResize = this.onWindowResize.bind(this)
        window.addEventListener('resize', this.bound_onWindowResize, false);

        // Setup keyboard callbacks

        this.bound_handleKeyDown = (event) => this.handleKeyDown(event)
        this.bound_handleKeyUp = (event) => this.handleKeyUp(event)


        this.bound_handleMouseUp = (event) => this.handleMouseUp(event)
        this.bound_handleMouseDown = (event) => this.handleMouseDown(event)
        this.bound_handleMouseMove = (event) => this.handleMouseMove(event)
        this.bound_handleMouseWheel = (event) => this.handleMouseWheel(event)

        window.addEventListener('keydown', this.bound_handleKeyDown, false);
        window.addEventListener('keyup', this.bound_handleKeyUp, false);

        window.addEventListener('mousedown', this.bound_handleMouseDown, false);
        window.addEventListener('mouseup', this.bound_handleMouseUp, false);
        window.addEventListener('mousemove', this.bound_handleMouseMove, false);
        window.addEventListener('mousewheel', this.bound_handleMouseWheel, false);

        // // Initialise and staru

        this.bound_update = () => this._update()

        this.init()
    }
    // private clear
    _clear() {

        this.tagName = ""
        this.isKeyDown = {}
        this.isMouseDown = {}
        this.mouse = {x: 0, y: 0, xVel: 0, yVel: 0, xPrev: 0, yPrev: 0, wheel: 0}

        if (this.clock) {
            this.clock.stop()
        }
        this.clock = undefined

        if (this.renderer) { // This is required if we want to destroy the WebGL context associated with the renderer
            this.renderer.forceContextLoss();
        }
        this.renderer = undefined

        // for old method of scheduling renders
        if (this.updateFunction){
            clearInterval(this.updateFunction)
        }
        this.updateFunction = undefined

        this.camera = undefined
        this.scene = undefined
    }


    handleKeyDown(event) {

        // console.log(event.keyCode)

        this.isKeyDown[event.keyCode] = true

        // console.log(this.isKeyDown)
        // TODO: Prevent Esc from messing up the scale when exiting fullscreen
        if (event.keyCode == 27) { //Esc
            // event.preventDefault()
        }

    }

    handleKeyUp(event) {
        this.isKeyDown[event.keyCode] = false
    }

    handleMouseUp(event) {
        this.isMouseDown[event.button] = false
    }

    handleMouseDown(event) {
        this.isMouseDown[event.button] = true
    }
    handleMouseMove(event) {

        this.mouse.x = event.x
        this.mouse.y = event.y
        // Buffer mouse velocity until next update.


        this.mouse.xVel += event.movementX
        this.mouse.yVel += event.movementY

        if (this.onMouseMove) {
            this.onMouseMove(event)
        }
    }
    handleMouseWheel(event) {
        // Buffer mouse wheel delta until next update.
        this.mouse.wheel += event.wheelDelta

        if (this.onMouseWheel) {
            this.onMouseWheel(event)
        }

    }


    onWindowResize() {

        let {camera, renderer} = this

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keyDown(key) {
        let keyCode = key.charCodeAt(0) - 32
        // console.log(keyCode)
        return this.isKeyDown[keyCode]
    }

    _update() {

        if (!this.forceFPS) {
            requestAnimationFrame(this.bound_update);
        }

        
        let delta = this.clock.getDelta()

        let currentSecond = Math.round(this.clock.getElapsedTime())
        this.framesThisSecond++
        // console.log(time)
        if (currentSecond !== this.prevSecond) {
            this.prevSecond = currentSecond
            // console.log(`Second: ${currentSecond} FPS: ${this.framesThisSecond}`)
            this.framesThisSecond = 0
        }

        // this.handleInput(delta)        

        this.update(delta)
        this.render();


        this.mouse.xVel = 0
        this.mouse.yVel = 0
        this.mouse.wheel = 0
    }


    render() {
        // console.log(this)
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this._init();
        this._update();
    }


    stop() {

        this.deInit()

        window.removeEventListener('resize', this.bound_onWindowResize)
        window.removeEventListener('keyup', this.bound_handleKeyUp)
        window.removeEventListener('keydown', this.bound_handleKeyDown)

        window.removeEventListener('mouseup', this.bound_handleMouseUp)
        window.removeEventListener('mousedown', this.bound_handleMouseDown)
        window.removeEventListener('mousemove', this.bound_handleMouseMove)
        window.removeEventListener('mousewheel', this.bound_handleMouseWheel)

        this.bound_onWindowResize = undefined
        this.bound_handleKeyUp = undefined
        this.bound_handleKeyDown = undefined
        this.bound_update = undefined

        // Cancel existing request for next frame
        cancelAnimationFrame(this.nextFrameRequest)

        // Remove canvas from the parent div to which it was added
        empty(this.parentDiv)

        // Do this last since it clears all local variables
        this._clear()

        function empty(elem) {
            while (elem.lastChild) elem.removeChild(elem.lastChild);
        }
    }
}

module.exports = {
    BaseGame
}