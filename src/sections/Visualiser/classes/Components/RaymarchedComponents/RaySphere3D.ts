import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { RayObject3D } from './RayObject3D';

export class RaySphere3D extends RayObject3D {
  _geometry: THREE.PlaneGeometry | null = null;

  constructor() {
    super();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
  }
}
