let THREE = require('./../../../libs/three/three')

let { Entity } = require('./entity')

let texture = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let texture1 = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let texture2 = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let man_image = new THREE.TextureLoader().load( "assets/survival2d/george.png")
let material = new THREE.SpriteMaterial( { map: man_image, color: 0xffffff } );
let sprite =  new THREE.Sprite( material );

class Man extends Entity {

    constructor(scene, x, y, z, kd) {
        super(scene, x, y, z, sprite.clone(), 4)
        this.t = 0
        this.keyDown = kd
    }

    update(delta) {
        this.t += delta


        let moveDir = new THREE.Vector3(0,0,0)
        if (this.keyDown('w')) {
          moveDir.z -= 1
        }
        if (this.keyDown('s')) {
          moveDir.z += 1
        }
        if (this.keyDown('d')) {
          moveDir.x += 1
        }
        if (this.keyDown('a')) {
          moveDir.x -= 1
        }

        moveDir.normalize()
        moveDir.multiplyScalar(delta * 5)

        this.move(moveDir)

        if (this.t > 500) {
            this.t = 0
        }
    }
}

module.exports = {
    Man: Man
}
