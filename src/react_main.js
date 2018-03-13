// import CustomButton from './components/custom_button.js'
let CustomButton = require('./components/custom_button')
window.onload = function () {
    class Greetings extends React.Component {
        render() {
            return React.createElement(
                'div', // Type
                null, // Props
                `Greetings, ${this.props.name}!`, // Body (optional),
                React.createElement('br'),
                React.createElement(CustomButton, {name: 'Jeff'})
            );
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
