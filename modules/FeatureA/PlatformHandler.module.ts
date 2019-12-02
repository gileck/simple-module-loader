import {PlatformHandler} from '../../types';

export default function(): PlatformHandler {
  return {
    a() {},
    b() {},
    openPopup(msg) {
      console.log('openPopup');
    }
  }
}
