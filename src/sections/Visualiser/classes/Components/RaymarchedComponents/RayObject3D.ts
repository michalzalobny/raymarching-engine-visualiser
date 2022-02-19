import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from '../InteractiveObject3D';

export class RayObject3D extends InteractiveObject3D {
  elPosition = new THREE.Vector3(0, 0, 0);

  constructor() {
    super();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
  }

  setElPosition(newPos: THREE.Vector3) {
    this.elPosition = newPos;
  }
}
