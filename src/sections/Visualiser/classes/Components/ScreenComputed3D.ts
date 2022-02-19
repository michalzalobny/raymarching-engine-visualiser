import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import vertexShader from '../shaders/screenComputed/vertex.glsl';
import fragmentShader from '../shaders/screenComputed/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

export class ScreenComputed3D extends InteractiveObject3D {
  static width = 5;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;

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
        uRandom: { value: Math.random() },
      },
    });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.position.y = ScreenComputed3D.width * 0.5;
    this._mesh.position.z = 0;
    this._mesh.position.x = -8 + ScreenComputed3D.width * 0.5;
    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    if (this._mesh) this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
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
