

// /*
// let SurvivalGame = require('./modules/survival')

// // Second argument allows forcing FPS.  Warning: this is buggy if machine cannot keep up
// let game = new SurvivalGame('myContainer')//, 120)

// game.start()
// */

let $ = require('./libs/jquery-3.2.1.js')

// Create a button for each module

let modulesPath = './src/modules/'
let modulesPathRelative = './modules/'

$(window).on('load', function(){
          const fs = require("fs");

          fs.readdir(modulesPath, (err, dir) => {
            //console.log(dir);
            for(let filePath of dir){

              // console.log(filePath);

              if (filePath.endsWith('.js')){

                let moduleName = filePath.replace('.js','')
                $('#moduleSelector').append(`
                  <div id='${moduleName}' class='module_buttons'> <button  >${moduleName}</button> </div>
                `)  
                $(`#${moduleName}`).on('click', 'button', () => {
                  // console.log('asdfasdf'))
                  let ModuleClass = require(`${modulesPathRelative}${filePath}`)
                  let game = new ModuleClass('myContainer')//, 120)

                  game.start()

                  // $('#moduleSelector').hide()
                  $('.module_buttons').hide()

                })
              }

              
            }
          });
      });