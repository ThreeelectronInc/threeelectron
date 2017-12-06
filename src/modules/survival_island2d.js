// THIS GAME BELONGS TO MIT
let THREE = require('./../libs/three/three')

let BaseGame = require('./../core/base_game')

let DeityCamera = require('./../core/camera/deity')

let { ipcRenderer, remote } = require('electron');

let TerrainGenerator = require('./../survival2d/terrain_generator')


class SurvivalIsland2D extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.time_elapsed = 0

        this.WORLD_WIDTH = 100
        this.WORLD_HEIGHT = 100
    }

    init() {



        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        // this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        this.camera.position.set(0, 500, 0)
        this.camera.lookAt(0,0,0)

        this.cameraControl = new DeityCamera(this.camera, (key) => this.keyDown(key), this.mouse)
        
        var textureGrass = new THREE.TextureLoader().load('assets/atlas.png');
        textureGrass.magFilter = THREE.NearestFilter;
        textureGrass.minFilter = THREE.LinearMipMapLinearFilter;


        var textureSand = new THREE.TextureLoader().load('assets/images/Sand.png');
        textureSand.magFilter = THREE.NearestFilter;
        textureSand.minFilter = THREE.LinearMipMapLinearFilter;

        var textureDirt = new THREE.TextureLoader().load('assets/images/Dirt.png');
        textureDirt.magFilter = THREE.NearestFilter;
        textureDirt.minFilter = THREE.LinearMipMapLinearFilter;

        var textureWater = new THREE.TextureLoader().load('assets/images/Water.png');
        textureWater.magFilter = THREE.NearestFilter;
        textureWater.minFilter = THREE.LinearMipMapLinearFilter;

        let matWater = new THREE.SpriteMaterial( { map: textureWater, color: 0xffffff } );
        let waterSprite =  new THREE.Sprite( matWater );

        var textureRock = new THREE.TextureLoader().load('assets/images/Rock.png');

        for (var x = 0; x < this.WORLD_WIDTH; x++) {
            for (var y = 0; y < this.WORLD_HEIGHT; y++) {
                let h = TerrainGenerator.getHeight(x, y)

                let waterClone = waterSprite.clone()
                waterClone.position.set(x, 0, y)

                console.log(h)
            }    
        }
        console.log("done")

    }

    deInit() {
    }

    update(delta) {

    }

}

module.exports = SurvivalIsland2D