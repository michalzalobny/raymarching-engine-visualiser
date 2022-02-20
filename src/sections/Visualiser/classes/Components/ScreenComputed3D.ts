import * as THREE from 'three';

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

  constructor() {
    super();
    this._drawScreenFrame();
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
    if (this._mesh) {
      this.remove(this._mesh);
    }
  }

  setRaymarchSettingsRef(objRef: RaymarchSettings) {
    this._raymarchSettingsRef = objRef;
  }
}
