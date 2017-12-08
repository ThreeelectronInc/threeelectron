// License: This belongs to MIT

let MaterialManager = require('./material_manager_new')
let THREE = require('./../../../libs/three/three')
let { TileType } = require('./tile')

MaterialManager.init_material(TileType.WATER, "assets/images/Water.png", (x) => new THREE.MeshBasicMaterial(x))
MaterialManager.init_material(TileType.SAND, "assets/images/Sand.png", (x) => new THREE.MeshBasicMaterial(x))
MaterialManager.init_material(TileType.DIRT, "assets/images/Dirt.png", (x) => new THREE.MeshBasicMaterial(x))
MaterialManager.init_material(TileType.GRASS, "assets/images/Grass.png", (x) => new THREE.MeshBasicMaterial(x))
MaterialManager.init_material(TileType.ROCK, "assets/images/Rock.png", (x) => new THREE.MeshBasicMaterial(x))
MaterialManager.init_material(TileType.TREE, "assets/images/Tree.png", (x) => new THREE.MeshBasicMaterial(x))
