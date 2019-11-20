import {UI, Feature} from '../../types';

export default function(ui: UI): Feature {
    return {
        doWork() {
            ui.Write('FeatureD')
        }
    }
}



