/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Text } from 'troika-three-text';

import { UpdateInfo, RaymarchSettings } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

export class ScreenFrame3D extends InteractiveObject3D {
  static width = 1;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.MeshPhysicalMaterial | null = null;
  _raymarchSettingsRef: RaymarchSettings | null = null;
  _pivotGroup = new THREE.Group();
  _label = new Text();

  constructor() {
    super();
    this._drawScreenFrame();
    this._label.text = 'Image plane';
    this._updateText();
  }

  _updateText() {
    this._label.anchorY = 'bottom';
    this._label.anchorX = 'center';
    this._label.fontSize = 0.25;
    this._label.font = '/fonts/openSans400.woff';
    this._label.color = 0x000000;
    this._label.outlineColor = 0xffffff;
    this._label.outlineWidth = '4%';
    this._pivotGroup.add(this._label);
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

      const labelVector = new THREE.Vector3()
        .crossVectors(roLookAt, r)
        .normalize()
        .multiplyScalar(0.6); //Offsets by 0.6
      this._label.position.set(labelVector.x, labelVector.y, -labelVector.z);

      const dir = Math.sign(this._raymarchSettingsRef.lookAt.z - this._raymarchSettingsRef.ro.z);
      this._mesh.rotation.x = (0.5 * Math.PI - roLookAt.angleTo(u)) * dir;
      this._label.rotation.x = (0.5 * Math.PI - roLookAt.angleTo(u)) * dir;
      this._pivotGroup.rotation.y = (0.5 * Math.PI - roLookAt.angleTo(r)) * -dir;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) this._pivotGroup.remove(this._mesh);
    this._pivotGroup.remove(this._label);
    this.remove(this._pivotGroup);
    this._label.dispose();
  }

  setRaymarchSettingsRef(objRef: RaymarchSettings) {
    this._raymarchSettingsRef = objRef;
  }
}
