import {BI, UI, PlatformHandler, Platform} from '../../types';

export default function(ui: UI, bi: BI, ...platformHandler: PlatformHandler[]): Platform {
    return {
        doWork() {
            bi.log('platform started')
            ui.Write('Platform')
            // @ts-ignore
            const platformHandlers = Object.assign(...platformHandler)
            const worker = new Worker('http://localhost:5000/modules/platform/worker.js')
            worker.onmessage = msg => platformHandlers[msg.data.type]()
        }
    }
}

