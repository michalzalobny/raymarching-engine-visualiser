import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from '../InteractiveObject3D';

export class RayObject3D extends InteractiveObject3D {
  _material = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.8,
    color: '#ffffff',
  });

  constructor() {
    super();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._material?.dispose();
  }
}
