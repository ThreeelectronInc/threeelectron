// THIS GAME BELONGS TO MIT
let THREE = require('./../libs/three/three')

let BaseGame = require('./../core/base_game')

let DeityCamera = require('./../core/camera/deity')

let { ipcRenderer, remote } = require('electron');

let TerrainGenerator = require('./../survival2d/terrain_generator')


class SurvivalIsland2D extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps, "#000000")

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
        this.camera.position.set(50, 50, 50)
        this.camera.lookAt(50,0,50)

        this.cameraControl = new DeityCamera(this.camera, (key) => this.keyDown(key), this.mouse)
        
        var textureGrass = new THREE.TextureLoader().load('assets/images/Grass.png');
        textureGrass.magFilter = THREE.NearestFilter;
        textureGrass.minFilter = THREE.LinearMipMapLinearFilter;


        var textureSand = new THREE.TextureLoader().load('assets/images/Sand.png');
        textureSand.magFilter = THREE.NearestFilter;
        textureSand.minFilter = THREE.LinearMipMapLinearFilter;

        var textureDirt = new THREE.TextureLoader().load('assets/images/Dirt.png');
        textureDirt.magFilter = THREE.NearestFilter;
        textureDirt.minFilter = THREE.LinearMipMapLinearFilter;

        var textureWater = new THREE.TextureLoader().load("assets/images/Water.png");
        textureWater.magFilter = THREE.NearestFilter;
        textureWater.minFilter = THREE.LinearMipMapLinearFilter;

        let matWater = new THREE.SpriteMaterial( { map: textureWater, color: 0xffffff } );
        let waterSprite =  new THREE.Sprite( matWater );

        let matGrass = new THREE.SpriteMaterial( { map: textureGrass, color: 0xffffff } );
        let grassSprite =  new THREE.Sprite( matGrass );

        let matSand = new THREE.SpriteMaterial( { map: textureSand, color: 0xffffff } );
        let sandSprite =  new THREE.Sprite( matSand );

        let matRock = new THREE.SpriteMaterial( { map: textureRock, color: 0xffffff } );
        let rockSprite =  new THREE.Sprite( matRock );


        var textureRock = new THREE.TextureLoader().load('assets/images/Rock.png');

        for (var x = 0; x < this.WORLD_WIDTH; x++) {
            for (var y = 0; y < this.WORLD_HEIGHT; y++) {
                let h = TerrainGenerator.getHeight(x * 0.1, y * 0.1)

                console.log(h)

                let tile = 0
                if (h < 0.3) {
                    tile = waterSprite.clone()
                }
                else if (h < 0.5) {
                    tile = sandSprite.clone()
                }
                else if (h < 0.8) {
                    tile = grassSprite.clone()
                }
                else {
                    tile = rockSprite.clone()
                }
    
                tile.position.set(x, 0, y)
                this.scene.add(tile)
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