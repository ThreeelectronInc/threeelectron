
class ModuleSelector extends React.Component {

    // constructor() {
    //     super()

    // }

    render() {

        let {modulesPath} = this.props 

        const fs = require("fs");

        let modules = fs.readdirSync(modulesPath)
            .filter(name => name !== '.DS_Store')
            .map( (moduleName, index) => {
                return React.createElement(
                    'option',
                    {
                        key: index,
                        value: moduleName,
                    },
                    moduleName
                )
            })
        return React.createElement(
            'select', // Type
            {
                onChange: event => {
                    if (this.props.onModuleSelected !== undefined) {
                        this.props.onModuleSelected(event.target.value)
                    }
                },
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '10px',
                },
                defaultValue: this.props.defaultSelected
            },
            modules,
        )
    }
}

module.exports = ModuleSelector