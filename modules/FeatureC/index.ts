
export default function(UI) {
    return {
        doWork() {
            UI.Write('FeatureC')
        }
    }
}

export const deps = ['UI']
export const name = 'FeatureC'


