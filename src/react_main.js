// import CustomButton from './components/custom_button.js'
let CustomButton = require('./components/custom_button')

let ModuleSelector = require('./components/module_selector')

window.onload = function () {


    class Greetings extends React.Component {

        constructor() {
            super()

            this.state = {
                moduleDirectory: __dirname + '/modules/',
                current: 'simpad'
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
