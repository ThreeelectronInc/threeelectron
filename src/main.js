/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */



// let SurvivalGame = require('./modules/survival_island2d/survival_island2d')
let SurvivalGame = require('./modules/survival/survival')
// let SurvivalGame = require('./modules/scratchpad/scratchpad')
// let SurvivalGame = require('./modules/audio_test/audio_test')
let game = new SurvivalGame('myContainer')//, 120)
game.start()


let $ = require('./libs/jquery-3.2.1.js')

// Create a button for each module

let modulesPath = __dirname + '/modules/'

let onClick = (filePath) => {

  if (game) { game.stop() }

  // console.log('asdfasdf'))
  let ModuleClass = require(`${modulesPath}${filePath}/${filePath}`)
  game = new ModuleClass('myContainer')//, 120)

  game.start()

  // $('#moduleSelector').hide()
  // $('.module_buttons').hide()

}

let onLoad = () => {

  const fs = require("fs");

  fs.readdir(modulesPath, (err, dir) => {
    if (err) {
      console.log(err)
    }
    else {

      //console.log(dir);
      for (let filePath of dir) {

        if (filePath !== '.DS_Store') {

          // console.log(filePath);

          // if (filePath.endsWith('.js')) {

          // let moduleName = filePath.replace('.js', '')
          $('#moduleSelector').append(`
                    <div style='' class='module_buttons'> <button id='${filePath}' >${filePath}</button> </div>
                  `)
          fs.readdir(modulesPath + '/' + filePath, (err, dir) => {

          })


          // $(`#${moduleName}`).on('click', 'button', () => onClick(filePath, moduleName))
          $(`#${filePath}`).mousedown(() => onClick(filePath))
          // }
 
        }



      }

      // $('.module_buttons').hide() 
    }

  });

}

$(window).on('load', onLoad);

window.addEventListener('keydown', () => {
  if (event.keyCode == 27) { //Esc
    // event.preventDefault()
    game.stop()
    $('.module_buttons').show()
  }
})