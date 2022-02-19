import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from '../InteractiveObject3D';

export class RayObject3D extends InteractiveObject3D {
  constructor() {
    super();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
  }
}
