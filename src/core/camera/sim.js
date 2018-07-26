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

        this.camera.lookAt(this.lookPos);
    }
}

module.exports = DeityCamera