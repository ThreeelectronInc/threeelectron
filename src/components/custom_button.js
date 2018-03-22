
class CustomButton extends React.Component{
    render() {
        return React.createElement(
            'button', // Type
            // null, // Props
            {
                onClick: event => console.log(event.target.value),
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '10px',
                },
                value: 'woot',
            },
            `${this.props.name}` // Body (optional)
        )
    }
}

module.exports = CustomButton