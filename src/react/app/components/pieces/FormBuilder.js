import { _, $, div, MultiInput, form, button } from 'factories'

export default (formSchema, options) => {
    options = {
        ...{
            onSelect: (value, field) => {
                console.warn(`Field '${field}' has been selected but there is no select handler!`)
            },
            onSubmit: e => {
                e.preventDefault()
                console.warn(`Form was submitted but there is no submit handler!`)
            },
            setState: state => {
                console.warn('Trying to set state without providing a state setter')
            }
        },
        ...options
    }

    const fields = {}
    formSchema.forEach(field => {
        const find = field => field.forEach(input => {
            const add = piece => {
                fields[piece.name] = piece
                if (piece.additional) {
                    fields[piece.additional.name] = piece.additional
                }
            }
            if (Array.isArray(input)) {
                input.forEach(piece => {
                    if (piece.type != 'custom') {
                        add(piece)
                    }
                })
            } else {
                if (input.type != 'custom') {
                    add(input)
                }
            }
        })

        if (Array.isArray(field)) {
            find(field)
        } else {
            find(field.elements)
        }
    })

    const checkField = (value, field) => {
        field = fields[field]
        const label = field.label || field.name || 'Field'
        const regex = {
            email: {
                checkString: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                error: `${label} must be an email address`
            },
            text: {
                checkString: /^[A-z ]+$/,
                error: `${label} must only container letters`
            },
            integer: {
                checkString: /^[0-9.]+$/,
                error: `${label} must be a number`
            },
            number: {
                checkString: /^[0-9]+$/,
                error: `${label} must be a number`
            },
            alphanumeric: {
                checkString: /^[A-z 0-9]+&/,
                error: `${label} can only be numbers or letters`
            },
            bool: {
                checkString: /(true|false)/
            },
            string: {
                checkString: /(.*)/,
                error: 'How did you get an error for this type?'
            },
            date: {
                checkString: /^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
                error: `${label} must be a date`
            }
        }
        const result = {
            errors: [],
            valid: true,
            value: value,

            check: true,
            min: true,
            max: true
        }

        if (field.check) {
            const check = regex[field.check]
            if (check) {
                if (!check.checkString.test(value)) {
                    result.valid = false
                    result.check = false
                    result.errors.push(check.error)
                }
            } else {
                console.warn(`${field.check} is not a known regex type check`)
            }
        }

        if (field.min) {
            if (field.check == 'numeric') {
                if (value < field.min) {
                    result.valid = false
                    result.min = false
                    result.errors.push(`Field cannot be less than ${field.min}`)
                }
            } else {
                if (value.length < field.min) {
                    result.valid = false
                    result.min = false
                    result.errors.push(`Field cannot be less than ${field.min} characters long`)
                }
            }
        }

        if (field.max) {
            if (field.type == 'numeric') {
                if (value > field.max) {
                    result.valid = false
                    result.max = false
                    result.errors.push(`Field cannot be more than ${field.max}`)
                }
            } else {
                if (value.length > field.max) {
                    result.valid = false
                    result.max = false
                    result.errors.push(`Field cannot be more than ${field.max} characters long`)
                }
            }
        }


        if (field.only) {
            if (Array.isArray(field.only)) {
                if (_.find(field.only, value) === 'undefined') {
                    result.valid = false
                    result.errors.push(`Field can only be one of the following:`, field.only)
                }
            } else {
                console.warn("'only' check must be an array")
            }
        }

        if (field.custom) return field.custom(value, field, result)
        return result
    }

    const checkAll = submittedFields => {
        const result = {
            fields: {},
            valid: true
        }
        const isRequired = field => {
            const fieldObj = {
                valid: true,
                errors: []
            }
            if (fields[field].required) {
                if (!submittedFields[field] || (submittedFields[field] && !submittedFields[field][fields[field].required])) {
                    result.valid = false
                    fieldObj.valid = false
                    fieldObj.errors = [`Required`]
                }
            }

            result.fields = {
                ...result.fields,
                ...{
                    [field]: {
                        ...submittedFields[field],
                        ...fieldObj
                    }
                }
            }
        }

        for (let field in fields) {
            const fieldData = fields[field]
            const label = fieldData.label || fieldData.name || 'Field'
            let found = false
            for (let submittedField in submittedFields) {
                const submittedData = submittedFields[submittedField]
                if (submittedField == field) {
                    const value = submittedData.value
                    found = true

                    if (value == null || value == '') {
                        isRequired(submittedField)
                    } else {
                        const checked = checkField(value, field)

                        if (fieldData.sameAs) {
                            const fieldToMatch = fieldData.sameAs
                            if (submittedFields[fieldToMatch]) {
                                if (submittedFields[fieldToMatch].value != value) {
                                    checked.valid = false
                                    checked.sameAs = false
                                    checked.errors = [`${label} must match ${fields[fieldToMatch].label}`]
                                }
                            } else {
                                console.warn(`The field '${fieldToMatch}' doesn't exist in the provided fields`)
                            }
                        }

                        result.fields = {
                            ...result.fields,
                            ...{
                                [field]: checked
                            }
                        }

                        if (!checked.valid) {
                            result.valid = false
                        }
                    }
                }
            }

            if (!found) {
                isRequired(field)
            }
        }

        return result
    }

    const handleChange = (value, field) => {
        options.setState({
            [field]: checkField(value, field)
        })
    }

    const getInput = (name, value, additionalValue, state) => {
        const field = fields[name]
        let additional = null

        if (field.additional) {
            additional = {
                ...field.additional,
                ...additionalValue
            }
        }

        return MultiInput({
            type: field.type,
            placeholder: field.placeholder,
            name: field.name,
            data: value,
            onChange: options.onChange || handleChange,
            onSelect: options.onSelect,
            key: field.name,
            label: field.label,
            additional: additional,
            tools: {
                setState: options.setState,
                state: state,
                checkField: checkField
            }
        })
    }

    const generateForm = (state, handlers, ...children) => {
        options = {
            ...options,
            ...handlers
        }
        const childComponents = children.map((child, index) => ({...child, key: index}))

        return (
            form({className: 'form', onSubmit: options.onSubmit},
                formSchema.map((field, index) => {
                        const formField = (field, className) => (
                            div({className: `form-field ${className || ''}`, key: index},
                                field.map(piece => {
                                        const input = input => {
                                            return input.type != 'custom' ?
                                                getInput(input.name, state[input.name], input.additional ? state[input.additional.name] : null, state)
                                                :
                                                $(input.element, {...input.props, ...{key: input.value}}, input.value)
                                        }

                                        const component = Array.isArray(piece) ?
                                            div({className: 'group', key: index},
                                                piece.map(group => (
                                                        input(group)
                                                    )
                                                )
                                            ) : input(piece)

                                        return component
                                    }
                                )
                            )
                        )

                        if (Array.isArray(field)) {
                            return formField(field)
                        } else {
                            return formField(field.elements, field.className)
                        }
                    }
                ),
                childComponents
            )
        )
    }

    return {
        generateForm: generateForm,
        getInput: getInput,
        checkField: checkField,
        checkAll: checkAll,
        handleChange: handleChange,
        addStateSetter: stateSetter => {
            options = {
                ...options,
                ...{
                    setState: stateSetter
                }
            }
        },

        getFields: () => fields,

        handleSubmit: (fields, success) => {
            const result = checkAll(fields)
            options.setState(result.fields)
            if (result.valid) {
                success(result.fields)
            }
        }
    }
}