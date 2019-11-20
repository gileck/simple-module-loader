import {PlatformHandlers} from '../../types';

export default function(): PlatformHandlers {
    return {
        getPlatformHandlers() {
            return {
                a() {},
                b() {},
                openPopup(msg) {
                    // console.log('openPopup');
                }
            }
        }
    }
}