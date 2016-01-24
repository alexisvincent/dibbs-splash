import { Component, PropTypes, createFactory as fact } from 'react'
import { div, input, textarea, p, transition } from 'factories'

class Input extends Component {

    static propTypes = {
        data: PropTypes.object,
        onChange: PropTypes.func,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }

    static defaultProps = {
        data: {
            value: '',
            errors: [],
            date: null
        },
        onChange: (value, name) => {
            console.warn(`Input field '${name}' has no change handler!`)
        }
    }

    constructor() {
        super()

        this.state = {
            focused: null
        }
    }

    componentWillReceiveProps(props) {
        if (props !== this.props) this.forceUpdate()
    }

    render() {
        const { label, type, data, placeholder, name, onChange, key, id } = this.props
        const { focused } = this.state
        const error = data.errors ? data.errors[0] : ''

        const commonProps = {
            type: type,
            className: '__input__',
            placeholder: placeholder || label,
            value: data.value,
            id: id,
            onChange: e => onChange(e.target.value, name),
            onFocus: () => this.setState({focused: '__focused__'}),
            onBlur: () => this.setState({focused: null})
        }

        const inputs = {
            text: {
                component: input,
                props: {
                    ...commonProps,
                    ...{type: 'text'}
                }
            },
            password: {
                component: input,
                props: {
                    ...commonProps,
                    ...{type: 'password'}
                }
            },
            'text-area': {
                component: textarea,
                props: {
                    ...commonProps,
                    ...{
                        className: '__text-area__'
                    }
                }
            }
        }
        const componentType = inputs[type]

        return (
            div({className: `__input-container__ ${focused} ${error ? '__error__' : ''}`, key: key},
                div({className: '__input__'},
                    componentType.component(componentType.props)
                ),
                div({className: '__border__'},
                    div({className: '__selected-border__'})
                ),

                div({className: '__label__'},
                    error ?
                        p({}, error) :
                        data.value || data.date ?
                            p({}, label) : null
                )
            )
        )
    }
}
export default fact(Input)