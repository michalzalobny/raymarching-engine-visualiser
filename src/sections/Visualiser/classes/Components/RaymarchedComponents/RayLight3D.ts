import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { LabeledSphere3D } from '../../Components/LabeledSphere3D';
import { RayObject3D } from './RayObject3D';

export class RayLight3D extends RayObject3D {
  _light: THREE.PointLight | null = null;
  _label = new LabeledSphere3D({ size: 0.2, color: new THREE.Color('#ffffff') });

  constructor() {
    super();
    this._addLight();
  }

  _addLight() {
    this._light = new THREE.PointLight(0xffffff, 1, 1000);
    this._light.castShadow = true;
    this._light.shadow.mapSize.width = 2048;
    this._light.shadow.mapSize.height = 2048;
    this.add(this._light);
    this.add(this._label);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._label.update(updateInfo);
  }

  destroy() {
    super.destroy();
    if (this._light) this.remove(this._light);
    this._label.destroy();
    this.remove(this._label);
  }

  setElPosition(newPos: THREE.Vector3) {
    super.setElPosition(newPos);
    this._light?.position.set(this.elPosition.x, this.elPosition.y, -this.elPosition.z);
    this._light && this._label.setElPosition(this._light?.position);
  }

  setLightColor(newCol: [number, number, number]) {
    this._light?.color.setRGB(newCol[0], newCol[1], newCol[2]);
  }
}
