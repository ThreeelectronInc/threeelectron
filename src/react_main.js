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

            this.startModule()
        }
        componentDidUpdate(prevProps, prevState) {

            if (this.state.current !== prevState.current) {
                this.startModule()
            }
        }
        render() {
            return React.createElement(
                'div', // Type
                null, // Props
                React.createElement(
                    ModuleSelector,
                    {
                        modulesPath: this.state.moduleDirectory,
                        onModuleSelected: name => this.setState(() => ({current: name}))
                    }
                ),
                `Greetings, ${this.props.name}!`, // Body (optional),
                React.createElement('br'),
                React.createElement(CustomButton, { name: 'Jeff' }),
            )
        }

        startModule(){

            if (this.game) { this.game.stop() }

            // console.log('asdfasdf'))
            let ModuleClass = require(`${this.state.moduleDirectory}${this.state.current}/${this.state.current}`)
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
