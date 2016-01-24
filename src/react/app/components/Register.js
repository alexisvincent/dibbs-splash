import { Component } from 'react'
import { div, img, p, FormBuilder, button, text, a } from 'factories'

export default
class container extends Component {

    constructor() {

        super();

        this.state = {success: true}
        this.form = FormBuilder(this.getForm(), {setState: state => this.setState(state)})
    }

    componentWillMount() {

    }

    componentWillReceiveProps(props) {

    }

    render() {
        const { success } = this.state

        return (
            div({className: 'container'},
                success ?
                    div({className: 'scrollable'},
                        div({className: 'success'},
                            div({className: 'success-title'},
                                p({}, "Success!")
                            ),

                            div({className: 'success-content'},
                                p({}, "Thank you for registering with ", text({}, "Dibbs!"), " We have sent you an email with more information. " +
                                    "Please read it and confirm your email address!"),

                                a({className: 'register', href: "/"}, "Go Back")
                            )
                        )
                    )
                    :
                div({className: 'scrollable'},
                    div({className: 'register-header'},
                        img({src: '/static/dibbs-white.png'})
                    ),

                    div({className: 'register-title'},
                        p({}, "Create Your Account")
                    ),

                    div({className: 'register-form'},
                        this.form.generateForm(this.state, {onSubmit: this.submit},
                            div({className: 'form-field'},
                                button({onClick: this.submit, className: 'button'}, "Register")
                            )
                        )
                    )
                )
            )
        )
    }

    submit = e => {
        e.preventDefault()
        const success = fields => {
            console.log(fields)
        }

        this.form.handleSubmit(this.state, success)
    }

    getForm() {
        return [
            [
                {
                    type: 'text',
                    check: 'text',
                    name: 'name',
                    label: 'Name',
                    required: true
                },
                {
                    type: 'text',
                    check: 'text',
                    name: 'surname',
                    label: 'Surname',
                    required: true
                },
                {
                    type: 'text',
                    check: 'number',
                    name: 'studentNumber',
                    label: 'Student Number',
                    min: 8,
                    max: 8,
                    required: true
                }
            ],

            [
                {
                    type: 'password',
                    check: 'string',
                    name: 'password',
                    label: 'Password',
                    required: true
                },
                {
                    type: 'password',
                    check: 'string',
                    name: 'password_confirm',
                    label: 'Confirm Password',
                    sameAs: 'password',
                    required: true
                }
            ]
        ]
    }
}