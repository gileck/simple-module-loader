import {BI, UI, PlatformHandlers, Platform} from '../../types';

export default function(ui: UI, platformHandlersArray: Array<PlatformHandlers>, bi: BI): Platform {
    return {
        doWork() {
            bi.log('platform started')
            ui.Write('Platform')
            // @ts-ignore
            const platformHandlers = Object.assign(...platformHandlersArray.map(item => item.getPlatformHandlers()))
            const worker = new Worker('http://localhost:5000/modules/platform/worker.js')
            worker.onmessage = msg => platformHandlers[msg.data.type]()
        }
    }
}

