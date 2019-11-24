import {UI} from '../../types';

export default function(): UI {
    return {
        Write(text) {
            const div = document.createElement('div')
            div.innerText = text
            document.body.appendChild(div)
        }
    }
}

