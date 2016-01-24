import { Component, PropTypes, createFactory as fact } from 'react'
import { div, Input } from 'factories'

class MultiInput extends Component {

    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,
        data: PropTypes.object,
        tools: PropTypes.object
    }

    static defaultProps = {
        onChange: (value, name) => {
            console.warn(`No change handler defined for field '${name}'`)
        }
    }

    componentWillReceiveProps(props) {
        if (props !== this.props) {
            this.forceUpdate()
        }
    }

    render() {
        const { type, label, onChange, name, multi, data, key, additional, tools } = this.props

        const commonProps = {
            onChange: onChange,
            name: name,
            multi: multi,
            data: data,
            type: type,
            label: label,
            key: key,
            additional: additional,
            tools: tools
        }

        const inputs = {
            text: {
                component: Input,
                props: commonProps
            },
            password: {
                component: Input,
                props: commonProps
            },
            'text-area': {
                component: Input,
                props: commonProps
            }
        }

        const componentType = inputs[type]

        return (
            componentType.component(componentType.props)
        )
    }
}
export default fact(MultiInput)