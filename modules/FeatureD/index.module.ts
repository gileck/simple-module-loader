import {UI, Feature} from '../../types';

export default function(ui: UI) {
    return {
        doWork() {
            ui.Write('FeatureD')
        }
    }
}



