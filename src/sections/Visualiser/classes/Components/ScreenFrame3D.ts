import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

export class ScreenFrame3D extends InteractiveObject3D {
  static width = 5;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.MeshPhysicalMaterial | null = null;

  constructor() {
    super();
    this._drawScreenFrame();
  }

  _drawScreenFrame() {
    this._geometry = new THREE.PlaneBufferGeometry(ScreenFrame3D.width, ScreenFrame3D.width);
    this._material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      ior: 1.5,
      reflectivity: 0.7,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      normalScale: new THREE.Vector2(0.3),
      clearcoatNormalScale: new THREE.Vector2(0.2),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      thickness: 2.5,
    });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.position.y = ScreenFrame3D.width * 0.5;
    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) {
      this.remove(this._mesh);
    }
  }
}
