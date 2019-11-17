import {UI} from '../../types';
import {modules} from '../../constants.ts';

export default function(ui: UI) {
    return {
        doWork() {
            ui.Write('FeatureA')
        }
    }
}


export const deps = [modules.UI]
export const name = modules.featureA


