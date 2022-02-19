import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { RayObject3D } from './RayObject3D';

export class RayLight3D extends RayObject3D {
  _light: THREE.PointLight | null = null;

  constructor() {
    super();
    this._addLight();
    this.setElPosition(new THREE.Vector3(0, 10, 0));
  }

  _addLight() {
    this._light = new THREE.PointLight(0xffffff, 1, 100);
    this.add(this._light);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    if (this._light) this.remove(this._light);
  }

  setElPosition(newPos: THREE.Vector3) {
    super.setElPosition(newPos);
    this._light?.position.set(this.elPosition.x, this.elPosition.y, this.elPosition.z);
  }
}
