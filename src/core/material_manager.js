let THREE = require('./../libs/three/three')

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

let textures = []
let materials = []

let BLOCK = require('./block')
textures[BLOCK.BlockType.WATER] = textureWater
materials[BLOCK.BlockType.WATER] = new THREE.MeshLambertMaterial({ map: textureWater, transparent: true, side: THREE.DoubleSide })

textures[BLOCK.BlockType.SAND] = textureSand
materials[BLOCK.BlockType.SAND] = new THREE.MeshLambertMaterial({ map: textureSand })

textures[BLOCK.BlockType.DIRT] = textureDirt
materials[BLOCK.BlockType.DIRT] = new THREE.MeshLambertMaterial({ map: textureDirt })

textures[BLOCK.BlockType.GRASS] = textureGrass
materials[BLOCK.BlockType.GRASS] = new THREE.MeshLambertMaterial({ map: textureGrass })

function getTexture(blockId) {
    return textures[blockId]
}

function getMaterial(blockId) {
    return materials[blockId]
}

module.exports = {
    getMaterial : getMaterial,
    getTexture : getTexture
}