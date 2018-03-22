
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
                    'button',
                    {
                        key: index,
                        style: {
                            backgroundColor: 'black',
                            color: 'white',
                            borderRadius: '10px',
                        },
                        onClick: event => {
                            if (this.props.onModuleSelected !== undefined) {
                                this.props.onModuleSelected(moduleName)
                            }
                        }
                    },
                    moduleName
                )
            })

        return React.createElement(
            'div', // Type
            {},
            modules,
        )
    }
}

module.exports = ModuleSelector