let THREE = require('./../../../libs/three/three')

let { Entity } = require('./entity')
let { TileType } = require('./../../../survival2d/tile')

let texture = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let texture1 = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let texture2 = new THREE.TextureLoader().load( "assets/survival2d/man_0.png" );
let man_image = new THREE.TextureLoader().load( "assets/survival2d/george.png")
let material = new THREE.SpriteMaterial( { map: man_image, color: 0xffffff } );
let sprite =  new THREE.Sprite( material );

class Man extends Entity {

    constructor(scene, x, y, z, kd) {
        super(scene, x, y, z, sprite.clone(), 0.5)
        this.t = 0
        this.keyDown = kd

        let numCols = 4
        let numRows = 4
        let col = 1 / numCols
        let row = 1 / numRows
        man_image.offset.set(0, 0)
        man_image.repeat.set(col, row)

        this.setSpriteTile = (i, j) => {
            man_image.offset.set(i * col, j * row)
        }

        this.i = 0
        this.speed = 3.0
        this.targetSpeed = 3.0
    }

    update(delta) {
        this.t += delta
        if (this.t > 0.2) {
            this.t = 0
            this.i++
            this.i %= 4
        }

        if (this.speed < this.targetSpeed) {
          this.speed += 0.25
        }
        else if (this.speed > this.targetSpeed) {
          this.speed -= 0.25
        }

        if (this.keyDown('f')) {
          console.log('action')
        }

        let moveDir = new THREE.Vector3(0,0,0)
        let move = false
        if (this.keyDown('w')) {
          this.setSpriteTile(2, this.i)
          moveDir.z -= 1
          move = true
        }
        if (this.keyDown('s')) {
          this.setSpriteTile(0, this.i)
          moveDir.z += 1
          move = true
        }
        if (this.keyDown('d')) {
          this.setSpriteTile(3, this.i)
          moveDir.x += 1
          move = true
        }
        if (this.keyDown('a')) {
          this.setSpriteTile(1, this.i)
          moveDir.x -= 1
          move = true
        }

        if (move) {
          moveDir.normalize()
          let tile = this.game.getTile(this.geometry.position.x,
            this.geometry.position.z)
          // Only fast on grass for now
          switch (tile) {
            case TileType.GRASS:
              this.targetSpeed = 6
              break;
            case TileType.DIRT:
              this.targetSpeed = 5
              break;
            case TileType.SAND:
              this.targetSpeed = 3
              break;
            default:
              this.targetSpeed = 1
              break;
          }
          moveDir.multiplyScalar(delta * this.speed)
          this.move(moveDir)
        }
    }
}

module.exports = {
    Man: Man
}
