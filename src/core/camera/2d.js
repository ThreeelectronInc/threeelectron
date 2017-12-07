/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


let THREE = require('./../../libs/three/three')

class DeityCamera {
    constructor(camera, keyDown, mouse) {

        this.camSpeed = 500

        this.camera = camera
        this.keyDown = keyDown
        this.mouse = mouse

        this.camera.position.set(0,10,0)

        this.lookPos =new THREE.Vector3(0,0,0)
        this.camera.lookAt(this.lookPos)
        // this.lookPos = this.camera.position.addVectors(this.camera.position, this.lookPos)
        
    }

    update(delta) {

        // Make short named wrapper since we'll be calling this method a lot here
        let keyD = (key) => this.keyDown(key)

        let camVel = this.camSpeed * delta

        let forwardVec = new THREE.Vector3()
        let mouseVec = new THREE.Vector3()
        let lookVec = new THREE.Vector3()
        let upVec = new THREE.Vector3(0, 0, -1)
        let leftVec = new THREE.Vector3(-1,0,0)

        lookVec.subVectors(this.lookPos, this.camera.position)

        forwardVec = lookVec.clone()
        forwardVec.y = 0


        forwardVec = forwardVec.normalize().multiplyScalar(delta * 1000)

        mouseVec = forwardVec.clone()


        // TODO: Make pan and zoom methods

        if (keyD("w")) { this.camera.position.add(upVec); this.lookPos.add(upVec) }
        if (keyD("s")) { this.camera.position.sub(upVec); this.lookPos.sub(upVec) }
        if (keyD("a")) { this.camera.position.add(leftVec); this.lookPos.add(leftVec) }
        if (keyD("d")) { this.camera.position.sub(leftVec); this.lookPos.sub(leftVec) }



        if (keyD("r")) { this.camera.position.y += camVel; this.lookPos.y += camVel }
        if (keyD("f")) { this.camera.position.y -= camVel; this.lookPos.y -= camVel }

        
        // console.log(forwardVec, this.camera.position)
        // this.camera.position.add(forwardVec)
        // console.log(forwardVec, this.camera.position)
        

        const mousePanSpeed = 0.25
        if (this.mouse.buttonDown[0]) {

            let gameElem = document.getElementById('myContainer');
            gameElem.requestPointerLock();

            let mousePan = upVec.clone().multiplyScalar(this.mouse.yVel * mousePanSpeed)
                .add(leftVec.clone().multiplyScalar(this.mouse.xVel * mousePanSpeed))


            this.camera.position.add(mousePan);

            this.lookPos.add(mousePan)

            console.log(this.mouse.yVel)
        }
        else {

            document.exitPointerLock();
            

        }

        
        let mouseWheelDelta = this.mouse.wheel * 0.25
        if (this.camera.position.y + mouseWheelDelta > 5){

            this.camera.position.y += mouseWheelDelta
            this.lookPos.y += mouseWheelDelta
        }

        this.camera.lookAt(this.lookPos);
    }
}

module.exports = DeityCamera