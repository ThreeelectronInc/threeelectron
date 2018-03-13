
class CustomButton extends React.Component{
    render() {
        return React.createElement(
            'button', // Type
            // null, // Props
            {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '10px',
                }
            },
            `This is a button called ${this.props.name}!` // Body (optional)
        )
    }
}

module.exports = CustomButton