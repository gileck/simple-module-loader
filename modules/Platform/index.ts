import {BI, UI} from '../../types';
import {modules, mergedModule} from '../../constants.ts'

export default function(ui: UI, platformHandlersArray: Array<object>, bi: BI) {
    // const state = {}
    return {
        doWork() {
            bi.log('platform started')
            ui.Write('Platform')
            // @ts-ignore
            const platformHandlers = Object.assign(...platformHandlersArray)
            const worker = new Worker('http://localhost:5000/modules/platform/worker.js')
            worker.onmessage = msg => platformHandlers[msg.data.type]()
        }
    }
}

export const name = modules.Platform
export const deps = [modules.UI, mergedModule.PlatformHandlers, modules.BI]

