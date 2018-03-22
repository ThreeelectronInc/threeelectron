
class CustomButton extends React.Component{
    render() {
        return React.createElement(
            'button', // Type
            // null, // Props
            {
                // onClick: event => console.log(event.target.value),
                // value: 'woot',
                onClick: event => this.props.onClick(event),
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '10px',
                },
            },
            `${this.props.name}` // Body (optional)
        )
    }
}

module.exports = CustomButton