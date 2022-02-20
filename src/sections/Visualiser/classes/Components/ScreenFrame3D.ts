import * as THREE from 'three';

import { UpdateInfo, RaymarchSettings } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

export class ScreenFrame3D extends InteractiveObject3D {
  static width = 1;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.MeshPhysicalMaterial | null = null;
  _raymarchSettingsRef: RaymarchSettings | null = null;
  _pivotGroup = new THREE.Group();

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
      opacity: 1,
      ior: 1.5,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      thickness: 1.2,
    });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._pivotGroup.add(this._mesh);
    this.add(this._pivotGroup);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._mesh && this._raymarchSettingsRef) {
      const r = new THREE.Vector3(1, 0, 0).normalize();
      const u = new THREE.Vector3(0, 1, 0).normalize();

      const roLookAt = new THREE.Vector3()
        .copy(this._raymarchSettingsRef.lookAt)
        .sub(this._raymarchSettingsRef.ro)
        .normalize();

      const screenPos = new THREE.Vector3(
        this._raymarchSettingsRef.ro.x,
        this._raymarchSettingsRef.ro.y,
        this._raymarchSettingsRef.ro.z
      ).add(new THREE.Vector3().copy(roLookAt).multiplyScalar(this._raymarchSettingsRef.zoom));

      this._pivotGroup.position.set(screenPos.x, screenPos.y, -screenPos.z);

      const dir = Math.sign(this._raymarchSettingsRef.lookAt.z - this._raymarchSettingsRef.ro.z);
      this._mesh.rotation.x = (0.5 * Math.PI - roLookAt.angleTo(u)) * dir;
      this._pivotGroup.rotation.y = (0.5 * Math.PI - roLookAt.angleTo(r)) * -dir;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) this.remove(this._mesh);
    this.remove(this._pivotGroup);
  }

  setRaymarchSettingsRef(objRef: RaymarchSettings) {
    this._raymarchSettingsRef = objRef;
  }
}
