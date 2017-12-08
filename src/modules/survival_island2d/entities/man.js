let THREE = require('./../../../libs/three/three')
let SoundManager = require('./../core/sound_manager')

let { Entity } = require('./entity')
let { TileType } = require('./../core/tile')


class Man extends Entity {

    constructor(game, x, y, z, kd) {
        super(game, x, y, z, 0.5, "assets/survival2d/george.png")
        this.t = 0
        this.keyDown = kd

        this.initSpriteSheet(this.image, 4, 4, (dir) => {
          if (dir.dot(new THREE.Vector3(0, 0, -1)) > 0.7) {
            this.setSpriteTile(2, this.i)
          }
          else if (dir.dot(new THREE.Vector3(0, 0, 1)) > 0.7) {
            this.setSpriteTile(0, this.i)
          }
          else if (dir.dot(new THREE.Vector3(-1, 0, 0)) > 0.7) {
            this.setSpriteTile(1, this.i)
          }
          else {
            this.setSpriteTile(3, this.i)
          }
        })

        this.i = 0
        this.speed = 3.0
        this.targetSpeed = 3.0
        this.footstepAudio = 0
        SoundManager.load_audio('modules/survival_island2d/earthyFootstep.mp3', 1, game.audioListener, (audio) => this.footstepAudio = audio)
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
          moveDir.z -= 1
          move = true
        }
        if (this.keyDown('s')) {
          moveDir.z += 1
          move = true
        }
        if (this.keyDown('d')) {
          moveDir.x += 1
          move = true
        }
        if (this.keyDown('a')) {
          moveDir.x -= 1
          move = true
        }

        if (move) {
          moveDir.normalize()
          // Only fast on grass for now
          switch (this.getTile()) {
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

          if (this.move(moveDir)) {
            if (!this.footstepAudio.isPlaying) {
              this.footstepAudio.play()
            }

          }
          else {
            this.footstepAudio.stop()
          }

        }
        else {
          if (this.footstepAudio && this.footstepAudio.isPlaying) {
            this.footstepAudio.stop()  
          }
        }
    }
}

module.exports = {
    Man: Man
}
