let THREE = require('./../../../libs/three/three')
let SoundManager = require('./../core/sound_manager')

let { Entity } = require('./entity')
let { TileType } = require('./../core/tile')
let Mathf = require('./../../../core/utils/math')

class Bear extends Entity {

    constructor(game, x, y, z, spriteSheetRowOffset = 0, spriteSheetColOffet = 0) {
        super(game, x, y, z, 0.5, "assets/survival2d/bears.png")
        this.t = 0

        this.initSpriteSheet(this.image, 8, 12, (dir) => {
          if (dir.dot(new THREE.Vector3(0, 0, -1)) > 0.7) {
            this.setSpriteTile(this.i + spriteSheetRowOffset, 0 + spriteSheetColOffet)
          }
          else if (dir.dot(new THREE.Vector3(0, 0, 1)) > 0.7) {
            this.setSpriteTile(this.i + spriteSheetRowOffset, 3 + spriteSheetColOffet)
          }
          else if (dir.dot(new THREE.Vector3(-1, 0, 0)) > 0.7) {
            this.setSpriteTile(this.i + spriteSheetRowOffset, 2 + spriteSheetColOffet)
          }
          else {
            this.setSpriteTile(this.i + spriteSheetRowOffset, 1 + spriteSheetColOffet)
          }
        })

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
          
          // Only fast on grass for now
          switch (this.getTile()) {
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
              if (vol > 0) {
                this.footstepAudio.setVolume(vol)
                this.footstepAudio.play()
              }
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

class BlackBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 9, 4)
  }
}

class RedBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 6, 0)
  }
}

class GoldenBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 9, 0)
  }
}

class WhiteBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 3, 4)
  }
}

class GreyBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 3, 0)
  }
}

class HazelBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 6, 4)
  }
}

class LightBrownBear extends Bear {
  constructor(game, x, y, z) {
    super(game, x, y, z, 0, 4)
  }
}

module.exports = {
    Bear: Bear,
    BlackBear: BlackBear,
    GoldenBear: GoldenBear,
    WhiteBear: WhiteBear,
    GreyBear: GreyBear,
    HazelBear: HazelBear,
    LightBrownBear: LightBrownBear,
    RedBear : RedBear
}
