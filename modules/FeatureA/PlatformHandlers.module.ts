import {PlatformHandlers} from '../../types';

export default function(): PlatformHandlers {
  return {
    a() {},
    b() {},
    openPopup(msg) {
      console.log('openPopup');
    }
  }
}
