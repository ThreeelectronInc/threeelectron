/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */



class DeityCamera {
    constructor(camera, keyDown, mouse, camSpeed = 500) {

        this.camSpeed = camSpeed

        this.r = 2;
        this.theta = Math.PI / 2;
        this.phi = -Math.PI / 2;

        this.camera = camera
        this.keyDown = keyDown
        this.mouse = mouse

        this.lookPos =new THREE.Vector3(0,0,0)
        // this.lookPos = this.camera.position.addVectors(this.camera.position, this.lookPos)

        this.pointerLockEnabled = false
        
    }

    update(delta) {

        // Make short named wrapper since we'll be calling this method a lot here
        let keyD = (key) => this.keyDown(key)

        let camVel = this.camSpeed * delta

        let forwardVec = new THREE.Vector3()
        let mouseVec = new THREE.Vector3()
        let lookVec = new THREE.Vector3()
        let upVec = new THREE.Vector3(0, 1, 0)
        let leftVec = upVec.clone()

        lookVec.subVectors(this.lookPos, this.camera.position)

        forwardVec = lookVec.clone()
        forwardVec.y = 0


        forwardVec = forwardVec.normalize().multiplyScalar(camVel)

        mouseVec = forwardVec.clone()

        leftVec.cross(forwardVec)

        // TODO: Make pan and zoom methods

        if (keyD("w")) { this.camera.position.add(forwardVec); this.lookPos.add(forwardVec) }
        if (keyD("s")) { this.camera.position.sub(forwardVec); this.lookPos.sub(forwardVec) }
        if (keyD("a")) { this.camera.position.add(leftVec); this.lookPos.add(leftVec) }
        if (keyD("d")) { this.camera.position.sub(leftVec); this.lookPos.sub(leftVec) }



        if (keyD("e")) { this.camera.position.y += camVel; this.lookPos.y += camVel }
        if (keyD("q")) { this.camera.position.y -= camVel; this.lookPos.y -= camVel }





        const mousePanSpeed = 0.25
        if (this.mouse.buttonDown[2]) {

            let gameElem = document.getElementById('myContainer')

            if (this.pointerLockEnabled){
                gameElem.requestPointerLock();
            }

            let mousePan = forwardVec.clone().multiplyScalar(this.mouse.yVel * mousePanSpeed)
                .add(leftVec.clone().multiplyScalar(this.mouse.xVel * mousePanSpeed))


            this.camera.position.add(mousePan);

            this.lookPos.add(mousePan)
        }
        else if (this.mouse.buttonDown[0] 
            // || this.mouse.buttonDown.length === 0 // Add this check to use look until a button is pressed 
        ) {


            let gameElem = document.getElementById('myContainer');
            
            if (this.pointerLockEnabled){
                gameElem.requestPointerLock();
            }

            // Update the spherical coordinates based on the mouse movement
            // and calculate the lookPos (offset from the camera position).
            // r >= 0
            // 0 < theta < 180
            // 0 <= phi < 360
            let xMouseSen = 0.005;
            let yMouseSen = 0.005;
            let minAngle = 0.001;
            this.theta += this.mouse.yVel * yMouseSen;
            if (this.theta >= Math.PI) {
                this.theta = Math.PI - minAngle;
            } else if (this.theta <= 0) {
                this.theta = minAngle;
            }
            this.phi += this.mouse.xVel * xMouseSen;
            let twoPI = 2 * Math.PI;
            while (this.phi > twoPI) this.phi -= twoPI;
            while (this.phi < 0) this.phi += 2 * twoPI;
            let lookAt = new THREE.Vector3(this.r * Math.sin(this.theta) * Math.cos(this.phi),
                this.r * Math.cos(this.theta),
                this.r * Math.sin(this.theta) * Math.sin(this.phi))
            this.lookPos = this.camera.position.clone()
            this.lookPos.add(lookAt);
            // console.log(lookAt)
        }
        else {

            if (this.pointerLockEnabled){
                document.exitPointerLock();    
            }

        }

        // mouseVec.multiplyScalar(this.mouse.wheel * 0.05)
        // this.camera.position.add(mouseVec)

        this.camera.position.y += this.mouse.wheel * camVel * 0.25
        this.lookPos.y += this.mouse.wheel * camVel * 0.25

        this.camera.lookAt(this.lookPos);
    }
}

module.exports = DeityCamera