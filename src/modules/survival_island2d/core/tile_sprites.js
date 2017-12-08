let SpriteManager = require('./sprite_manager')
let { TileType } = require('./tile')

SpriteManager.init_sprite(TileType.WATER, "assets/images/Water.png")
SpriteManager.init_sprite(TileType.SAND, "assets/images/Sand.png")
SpriteManager.init_sprite(TileType.DIRT, "assets/images/Dirt.png")
SpriteManager.init_sprite(TileType.GRASS, "assets/images/Grass.png")
SpriteManager.init_sprite(TileType.ROCK, "assets/images/Rock.png")
SpriteManager.init_sprite(TileType.TREE, "assets/images/Tree.png")