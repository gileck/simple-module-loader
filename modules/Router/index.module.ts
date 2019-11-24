import {UI, RouterHandlers, Router} from '../../types';

export default function(ui: UI, RouterHandlers: Array<RouterHandlers>):Router {
    return {
        doWork() {
            ui.Write('Router')
        }
    }
}


