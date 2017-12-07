let THREE = require('./../../../libs/three/three')

let { Entity } = require('./../../../core/entities/entity')

let texture = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let texture1 = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let texture2 = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
let sprite =  new THREE.Sprite( material );

class Man extends Entity {

    constructor(scene, x, y, z) {
        super(scene, x, y, z, sprite.clone(), 4)
        this.t = 0
    }
    
    update(delta) {
        this.t += delta

        if (this.t > 500) {
            material.texture = texture1
            this.t = 0
        }
    }

    position() {
        return this.geometry.position
    }
}

module.exports = {
    Man: Man
}