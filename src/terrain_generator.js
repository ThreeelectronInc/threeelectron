let THREE = require('./libs/three/three')

let noise = require('./improved_noise')

let blockScale = 10

var mesh;

let worldWidth = 128, worldDepth = 128
let worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2

let quality = 2

let terrain = generateHeight(worldWidth, worldDepth)

function generateHeight(width, height) {

    let data = [], perlin = new noise.ImprovedNoise(),
        size = width * height, z = Math.random() * blockScale;

    for (var j = 0; j < 4; j++) {

        if (j === 0) for (var i = 0; i < size; i++) data[i] = 0;

        for (var i = 0; i < size; i++) {

            var x = i % width, y = (i / width) | 0;
            data[i] += perlin.noise(x / quality, y / quality, z) * quality;

            // console.log(data[i])
        }

        quality *= 4;

    }

    return data;
}

function getY(x, z) {

    return (terrain[x + z * worldWidth] * 0.2) | 0;

}
function generateTerrain(scene) {
/*
    let grassTex = THREE.ImageUtils.loadTexture('assets/images/Grass.png');
    let dirtTex = THREE.ImageUtils.loadTexture('assets/images/Dirt.png');

    let SimplexNoise = require('simplex-noise')
    let noise = new SimplexNoise();

    let fieldSize = 100
    let halfField = fieldSize / 2

    let sampleSpread = 15

    let matGrass = new THREE.SpriteMaterial({ map: grassTex, color: 0xffffff });
    spriteGrass = new THREE.Sprite(matGrass);

    let matDirt = new THREE.SpriteMaterial({ map: dirtTex, color: 0xffffff });
    spriteDirt = new THREE.Sprite(matDirt);

    for (let x = -halfField; x < halfField; x++) {
        for (let z = -halfField; z < halfField; z++) {
            let sprite;
            let scale = 1//0.005;
            let height = noise.noise2D(x / sampleSpread, z / sampleSpread) * scale

            // let color_val = (1 + height / scale) * 0.5// * 0xffffff            
            // let color =  new THREE.Color(color_val, color_val, color_val)

            // let matGrass = new THREE.SpriteMaterial({ map: grassTex, color: color });
            // spriteGrass = new THREE.Sprite(matGrass);

            // let matDirt = new THREE.SpriteMaterial({ map: dirtTex, color: color });
            // spriteDirt = new THREE.Sprite(matDirt);

            if (height > 0) {
                sprite = spriteGrass.clone()
            }
            else {
                sprite = spriteDirt.clone()
            }

            sprite.position.set(x * 3, 20 + height * 9, z * 3);
            sprite.scale.set(1, 1, 1.0);

            scene.add(sprite);

        }
    }


*/



    var matrix = new THREE.Matrix4();
    var matrixWater = new THREE.Matrix4();

    var pxGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    pxGeometry.attributes.uv.array[1] = 0.5;
    pxGeometry.attributes.uv.array[3] = 0.5;
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(blockScale / 2, 0, 0);

    var nxGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    nxGeometry.attributes.uv.array[1] = 0.5;
    nxGeometry.attributes.uv.array[3] = 0.5;
    nxGeometry.rotateY(- Math.PI / 2);
    nxGeometry.translate(- blockScale / 2, 0, 0);

    var pyGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    pyGeometry.attributes.uv.array[5] = 0.5;
    pyGeometry.attributes.uv.array[7] = 0.5;
    pyGeometry.rotateX(- Math.PI / 2);
    pyGeometry.translate(0, blockScale / 2, 0);

    var pzGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    pzGeometry.attributes.uv.array[1] = 0.5;
    pzGeometry.attributes.uv.array[3] = 0.5;
    pzGeometry.translate(0, 0, blockScale / 2);

    var nzGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    nzGeometry.attributes.uv.array[1] = 0.5;
    nzGeometry.attributes.uv.array[3] = 0.5;
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, -blockScale / 2);

    //

    // BufferGeometry cannot be merged yet.
    var tmpLandGeometry = new THREE.Geometry();
    var tmpUnderwaterGeometry = new THREE.Geometry();
    var tmpWaterGeometry = new THREE.Geometry();

    var pxTmpGeometry = new THREE.Geometry().fromBufferGeometry(pxGeometry);
    var nxTmpGeometry = new THREE.Geometry().fromBufferGeometry(nxGeometry);
    var pyTmpGeometry = new THREE.Geometry().fromBufferGeometry(pyGeometry);
    var pzTmpGeometry = new THREE.Geometry().fromBufferGeometry(pzGeometry);
    var nzTmpGeometry = new THREE.Geometry().fromBufferGeometry(nzGeometry);

    for (var z = 0; z < worldDepth; z++) {

        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);

            matrix.makeTranslation(
                x * blockScale - worldHalfWidth * blockScale,
                h * blockScale,
                z * blockScale - worldHalfDepth * blockScale
            );

            var px = getY(x + 1, z);
            var nx = getY(x - 1, z);
            var pz = getY(x, z + 1);
            var nz = getY(x, z - 1);

            let tmpGeometry = tmpLandGeometry

            if (h < 0){     
                // console.log("HERE")           
                tmpGeometry = tmpUnderwaterGeometry

                
                
                matrixWater.makeTranslation(
                    x * blockScale - worldHalfWidth * blockScale,
                    0,
                    z * blockScale - worldHalfDepth * blockScale
                );
                tmpWaterGeometry.merge(pyTmpGeometry, matrixWater)
            }


            tmpGeometry.merge(pyTmpGeometry, matrix);

            if ((px !== h && px !== h + 1) || x === 0) {

                tmpGeometry.merge(pxTmpGeometry, matrix);

            }

            if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {

                tmpGeometry.merge(nxTmpGeometry, matrix);

            }

            if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {

                tmpGeometry.merge(pzTmpGeometry, matrix);

            }

            if ((nz !== h && nz !== h + 1) || z === 0) {

                tmpGeometry.merge(nzTmpGeometry, matrix);

            }

        }

    }

    var geometryLand = new THREE.BufferGeometry().fromGeometry(tmpLandGeometry);
    geometryLand.computeBoundingSphere();

    var textureLand = new THREE.TextureLoader().load('assets/atlas.png');
    textureLand.magFilter = THREE.NearestFilter;
    textureLand.minFilter = THREE.LinearMipMapLinearFilter;

    var meshLand = new THREE.Mesh(geometryLand, new THREE.MeshLambertMaterial({ map: textureLand }));
    scene.add(meshLand);



    var geometryDirt = new THREE.BufferGeometry().fromGeometry(tmpUnderwaterGeometry);
    geometryDirt.computeBoundingSphere();

    var textureDirt = new THREE.TextureLoader().load('assets/images/Dirt.png');
    textureDirt.magFilter = THREE.NearestFilter;
    textureDirt.minFilter = THREE.LinearMipMapLinearFilter;

    var meshDirt = new THREE.Mesh(geometryDirt, new THREE.MeshLambertMaterial({ map: textureDirt }));
    scene.add(meshDirt);



    var geometryWater = new THREE.BufferGeometry().fromGeometry(tmpWaterGeometry);
    geometryWater.computeBoundingSphere();

    var textureWater = new THREE.TextureLoader().load('assets/images/Water.png');
    textureWater.magFilter = THREE.NearestFilter;
    textureWater.minFilter = THREE.LinearMipMapLinearFilter;

    var meshWater = new THREE.Mesh(geometryWater, new THREE.MeshLambertMaterial({ map: textureWater, transparent: true }));
    scene.add(meshWater);

    // Lights

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    scene.add(directionalLight);



}

module.exports = {
    generateTerrain: generateTerrain,
}