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
        super(scene, x, y, z, sprite.clone(), 1)
        this.t = 0
        this.keyDown = kd

        this.col_frac = 1 / 4
        this.row_frac = 1 / 4
        man_image.repeat.set(this.col_frac, this.row_frac)
        man_image.offset.set(0, 0)

        this.setSpriteTile = (i, j) => {
            man_image.offset.set(i * this.col_frac, j * this.row_frac)
        }

        this.i = 0
    }

    update(delta) {
        this.t += delta
        if (this.t > 0.2) {
            this.t = 0
            this.i++
            this.i %= 4
        }

        let moveDir = new THREE.Vector3(0,0,0)
        if (this.keyDown('w')) {
          this.setSpriteTile(2, this.i)
          moveDir.z -= 1
        }
        if (this.keyDown('s')) {
          this.setSpriteTile(0, this.i)
          moveDir.z += 1
        }
        if (this.keyDown('d')) {
          this.setSpriteTile(3, this.i)
          moveDir.x += 1
        }
        if (this.keyDown('a')) {
          this.setSpriteTile(1, this.i)
          moveDir.x -= 1
        }

        moveDir.normalize()
        moveDir.multiplyScalar(delta * 5)

        this.move(moveDir)
    }
}

module.exports = {
    Man: Man
}
