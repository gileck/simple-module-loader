import {PlatformHandlers} from '../../types';

export default function(): PlatformHandlers {
    return {
        getPlatformHandlers() {
            return {
                c() {},
                d() {},
            }
        }
    }
}