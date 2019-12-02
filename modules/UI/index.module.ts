import {BI, UI} from '../../types';

export default function(bi: BI): UI {
    return {
        Write(text) {
            const div = document.createElement('div')
            div.innerText = text
            document.body.appendChild(div)
        }
    }
}

