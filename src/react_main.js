// import CustomButton from './components/custom_button.js'
let CustomButton = require('./components/custom_button')

let ModuleSelector = require('./components/module_selector')

window.onload = function () {


    // let defaultModule = 'saloon'
    let defaultModule = 'simpad'
    
    // Set target game module from command line if argument is specified
    let remote = require('electron').remote
    let arguments = remote.getGlobal('sharedObject').args;
    
    if ( arguments !== undefined && arguments.length > 2){
        defaultModule = arguments[2]
      }
    

    class Greetings extends React.Component {

        constructor() {
            super()

            this.state = {
                moduleDirectory: __dirname + '/modules/',
                current: defaultModule
            }

            this.startModule(this.state.current)
        }

        // componentDidUpdate(prevProps, prevState) {
        //     if (this.state.current !== prevState.current) {
        //         this.startModule()
        //     }
        // }
        componentWillUpdate(nextProps, nextState) {
            if (this.state.current !== nextState.current) {
                this.startModule(nextState.current)
            }
        }

        render() {
            let overlay = ''
            if (this.game !== undefined){
                overlay = this.game.gui(this)

            }

            return React.createElement(
                'div', // Type
                null, // Props,
                'Current Game Module: ',
                React.createElement(
                    ModuleSelector,
                    {
                        modulesPath: this.state.moduleDirectory,
                        onModuleSelected: name => this.setState(() => ({current: name})),
                        defaultSelected: this.state.current,
                    }
                ),
                overlay,
            )
        }

        startModule(name){

            if (this.game) { this.game.stop() }
            let ModuleClass = require(`${this.state.moduleDirectory}${name}/${name}`)
            this.game = new ModuleClass('myContainer')//, 120)
            this.game.start()
            
        }
    }
    ReactDOM.render(
        React.createElement(
            Greetings,
            { name: 'Alex' }
        ),
        document.getElementById('reactApp')
    );
};
