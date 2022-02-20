/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Text } from 'troika-three-text';

import { UpdateInfo, RaymarchSettings } from 'utils/sharedTypes';

import vertexShader from '../shaders/screenComputed/vertex.glsl';
import fragmentShader from '../shaders/screenComputed/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

export class ScreenComputed3D extends InteractiveObject3D {
  static width = 8;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;
  _raymarchSettingsRef: RaymarchSettings | null = null;
  _label = new Text();

  constructor() {
    super();
    this._drawScreenFrame();
    this._label.text = '(Image plane - computed in shader)';
    this._updateText();
  }

  _updateText() {
    this._label.anchorY = 'bottom';
    this._label.anchorX = 'center';
    this._label.fontSize = 0.36;
    this._label.font = '/fonts/openSans400.woff';
    this._label.color = 0x000000;
    this._label.outlineColor = 0xffffff;
    this._label.outlineWidth = '4%';
    this.add(this._label);
  }

  _drawScreenFrame() {
    this._geometry = new THREE.PlaneBufferGeometry(ScreenComputed3D.width, ScreenComputed3D.width);
    this._material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      depthWrite: true,
      depthTest: true,
      uniforms: {
        uTime: { value: 0 },
        uRo: { value: new THREE.Vector3(0.0) },
        uLookAt: { value: new THREE.Vector3(0.0) },
        uZoom: { value: 1.0 },
        uLightPos: { value: new THREE.Vector3(0.0) },
        uSphere: { value: new THREE.Vector3(0.0) },
        uBox: { value: new THREE.Vector3(0.0) },
        uTorus: { value: new THREE.Vector3(0.0) },
        uLightColor: { value: new THREE.Vector3(1.0) },
        uRaySmooth: { value: 0.0 },
      },
    });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.position.y = ScreenComputed3D.width * 0.6;
    this._mesh.position.z = -8;
    this._mesh.position.x = -ScreenComputed3D.width;
    this._mesh.rotation.y = Math.PI * 0.25;

    this._label.position.x = this._mesh.position.x;
    this._label.position.y = this._mesh.position.y + ScreenComputed3D.width * 0.5 + 0.15;
    this._label.position.z = this._mesh.position.z;
    this._label.rotation.y = this._mesh.rotation.y;

    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    if (this._mesh) this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    if (this._mesh && this._raymarchSettingsRef) {
      this._mesh.material.uniforms.uRo.value = this._raymarchSettingsRef.ro;
      this._mesh.material.uniforms.uLookAt.value = this._raymarchSettingsRef.lookAt;
      this._mesh.material.uniforms.uZoom.value = this._raymarchSettingsRef.zoom;
      this._mesh.material.uniforms.uLightPos.value = this._raymarchSettingsRef.lightPos;
      this._mesh.material.uniforms.uSphere.value = this._raymarchSettingsRef.sphere;
      this._mesh.material.uniforms.uBox.value = this._raymarchSettingsRef.box;
      this._mesh.material.uniforms.uTorus.value = this._raymarchSettingsRef.torus;
      this._mesh.material.uniforms.uLightColor.value = new THREE.Vector3(
        this._raymarchSettingsRef.lightColor[0],
        this._raymarchSettingsRef.lightColor[1],
        this._raymarchSettingsRef.lightColor[2]
      );
      this._mesh.material.uniforms.uRaySmooth.value = this._raymarchSettingsRef.raySmooth;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) this.remove(this._mesh);
    this.remove(this._label);
    this._label.dispose();
  }

  setRaymarchSettingsRef(objRef: RaymarchSettings) {
    this._raymarchSettingsRef = objRef;
  }
}
