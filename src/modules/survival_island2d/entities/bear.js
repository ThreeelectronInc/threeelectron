let THREE = require('./../../../libs/three/three')
let SoundManager = require('./../core/sound_manager')

let { Entity } = require('./entity')
let { TileType } = require('./../core/tile')
let Mathf = require('./../../../core/utils/math')

let bear_image = new THREE.TextureLoader().load( "assets/survival2d/bears.png")
let material = new THREE.SpriteMaterial( { map: bear_image, color: 0xffffff } );
let sprite =  new THREE.Sprite( material );

class Bear extends Entity {

    constructor(game, x, y, z) {
        super(game, x, y, z, sprite.clone(), 0.5)
        this.t = 0

        let numCols = 12
        let numRows = 8
        let col = 1 / numCols
        let row = 1 / numRows
        bear_image.offset.set(0, 0)
        bear_image.repeat.set(col, row)

        this.setSpriteTile = (i, j) => {
            bear_image.offset.set(i * col, j * row)
        }

        this.i = 0
        this.speed = 3.0
        this.targetSpeed = 3.0
        this.footstepAudio = 0
        SoundManager.load_audio('modules/survival_island2d/earthyFootstep.mp3', 1, game.audioListener, (audio) => this.footstepAudio = audio)

        this.pickTarget()
    }

    pickTarget() {
        this.randomOffset = new THREE.Vector3(Math.random() * 2 -1, 0, Math.random() * 2 -1)
        this.randomOffset.multiplyScalar(3)
        this.randomOffset.add(this.geometry.position)
    }

    update(delta) {
        this.t += delta
        if (this.t > 0.2) {
            this.t = 0
            this.i++
            this.i %= 3
        }

        if (this.speed < this.targetSpeed) {
          this.speed += 0.25
        }
        else if (this.speed > this.targetSpeed) {
          this.speed -= 0.25
        }

        let moveDir = new THREE.Vector3(0,0,0)
        moveDir.subVectors(this.randomOffset, this.geometry.position)

        let move = false
        if (moveDir.manhattanLength() > 0.1) {
            move = true
        }
        else {
          this.pickTarget()
        }

        if (move) {
          
          moveDir.normalize()
          
          let tile = this.game.getTile(this.geometry.position.x,
            this.geometry.position.z)
          // Only fast on grass for now
          switch (tile) {
            case TileType.GRASS:
              this.targetSpeed = 1
              break;
            case TileType.DIRT:
              this.targetSpeed = 1
              break;
            case TileType.SAND:
              this.targetSpeed = 0.5
              break;
            default:
              this.targetSpeed = 0.2
              break;
          }
          moveDir.multiplyScalar(delta * this.speed)

          if (this.move(moveDir)) {
            if (!this.footstepAudio.isPlaying) {
              let d = this.game.man.geometry.position.distanceTo(this.geometry.position)
              let vol = Mathf.lerp(1, 0, d / 8)
              this.footstepAudio.setVolume(vol)
              this.footstepAudio.play()
            }

            moveDir.normalize()

            if (moveDir.dot(new THREE.Vector3(0, 0, -1)) > 0.7) {
              this.setSpriteTile(this.i, 0)
            }
            else if (moveDir.dot(new THREE.Vector3(0, 0, 1)) > 0.7) {
              this.setSpriteTile(this.i, 3)
            }
            else if (moveDir.dot(new THREE.Vector3(-1, 0, 0)) > 0.7) {
              this.setSpriteTile(this.i, 2)
            }
            else {
              this.setSpriteTile(this.i, 1)
            }
          }
          else {
            this.pickTarget()
            if (this.footstepAudio.isPlaying) {
              this.footstepAudio.stop()
            }
          }

        }
        else {
          if (this.footstepAudio && this.footstepAudio.isPlaying) {
            this.pickTarget()
            this.footstepAudio.stop()  
          }
        }

    }
}

module.exports = {
    Bear: Bear
}
