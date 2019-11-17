export default function(UI) {
    return {
        doWork() {
            UI.Write('FeatureD')
        }
    }
}

export const deps = ['UI']
export const name = 'FeatureD'


