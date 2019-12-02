import {UI, RouterHandler, Router} from '../../types';

export default function(ui: UI, ...routerHandlers: RouterHandler[]):Router {
    return {
        doWork() {
            ui.Write('Router')
        }
    }
}


