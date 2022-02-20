import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { RayObject3D } from './RayObject3D';

export class RayTorus3D extends RayObject3D {
  _geometry: THREE.TorusBufferGeometry | null = null;
  _mesh: THREE.Mesh<THREE.TorusBufferGeometry, THREE.MeshStandardMaterial> | null = null;
  _material: THREE.MeshStandardMaterial | null = null;

  constructor() {
    super();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.TorusBufferGeometry(1.5, 0.5, 64, 64);
    this._material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.castShadow = true;
    this._mesh.receiveShadow = true;
    this._mesh.rotation.x = Math.PI * 0.5;
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
    super.setElPosition(newPos);
    this._mesh?.position.set(this.elPosition.x, this.elPosition.y, -this.elPosition.z);
  }
}
