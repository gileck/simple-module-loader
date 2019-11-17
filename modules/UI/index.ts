export default function() {
    return {
        Write(text) {
            const div = document.createElement('div')
            div.innerText = text
            document.body.appendChild(div)
        }
    }
}

export const deps = []
export const name = 'UI'

