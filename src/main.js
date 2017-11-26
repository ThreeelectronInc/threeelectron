let {SurvivalGame} = require('./modules/survival')

// Second argument allows forcing FPS.  Warning: this is buggy if machine cannot keep up
// let game = new SurvivalGame('myContainer', 120)
let game = new SurvivalGame('myContainer')//, 120)

game.start()