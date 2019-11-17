import {UI} from '../../types';
import {mergedModule, modules} from '../../constants.ts';

export default function(ui: UI, RouterHandlers: Array<object>) {
    return {
        doWork() {
            ui.Write('Router')
            console.log({RouterHandlers});

        }
    }
}

export const deps = [modules.UI, mergedModule.RouterHandlers]
export const name = modules.Router


