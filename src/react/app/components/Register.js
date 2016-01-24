import { Component } from 'react'
import { div, img, p, FormBuilder, button, text, a } from 'factories'

export default
class container extends Component {

    constructor() {

        super();

        this.state = {success: false, error: ''}
        this.form = FormBuilder(this.getForm(), {setState: state => this.setState(state)})
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
                                p({}, "Thank you for registering with ", text({}, "Dibbs!"), " We will be in touch."),

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

                    div({className: 'error-message'},
                        p({}, this.state.error)
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
            fetch('api.dibbsit.co.za/register', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: fields.name.value,
                    last_name: fields.surname.value,
                    student_number: fields.studentNumber.value,
                    password: fields.password.value,
                    password_confirmation: fields.password_confirmation.value
                })
            }).then(res => {
                if (res.status == 201) {
                    this.setState({success: true})
                } else if (res.status == 409) {
                    this.setState({
                        error: "That student number has already been used!"
                    })
                } else {
                    this.setState({
                        error: "Oops. Something went wrong."
                    })
                }
            })
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
                    name: 'password_confirmation',
                    label: 'Confirm Password',
                    sameAs: 'password',
                    required: true
                }
            ]
        ]
    }
}