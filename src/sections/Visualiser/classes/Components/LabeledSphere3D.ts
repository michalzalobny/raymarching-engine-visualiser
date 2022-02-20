import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from '../Components/InteractiveObject3D';

interface Constructor {
  size: number;
  color: THREE.ColorRepresentation;
}

export class LabeledSphere3D extends InteractiveObject3D {
  _geometry: THREE.SphereBufferGeometry | null = null;
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.MeshBasicMaterial> | null = null;
  _material: THREE.MeshBasicMaterial | null = null;

  constructor({ color, size }: Constructor) {
    super();
    this._drawSphere(size, color);
  }

  _drawSphere(size: number, color: THREE.ColorRepresentation) {
    this._geometry = new THREE.SphereBufferGeometry(size, 16, 16);
    this._material = new THREE.MeshBasicMaterial({ color });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._material?.dispose();
    if (this._mesh) this.remove(this._mesh);
    this._geometry?.dispose();
  }

  setElPosition(newPos: THREE.Vector3) {
    this._mesh?.position.set(newPos.x, newPos.y, newPos.z);
  }
}
