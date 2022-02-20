import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from '../Components/InteractiveObject3D';

export class LabeledSphere3D extends InteractiveObject3D {
  _geometry: THREE.SphereBufferGeometry | null = null;
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.MeshBasicMaterial> | null = null;
  _material: THREE.MeshBasicMaterial | null = null;

  constructor() {
    super();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.SphereBufferGeometry(0.3, 16, 16);
    this._material = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.castShadow = true;
    this._mesh.receiveShadow = true;
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
