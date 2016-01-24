import { createElement } from 'react'
import { render } from 'react-dom'
import Register from './components/Register'

window.onload = () => {
    render(createElement(Register), document.getElementById("app"))
};
