import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import vertexShader from '../shaders/screenFrame/vertex.glsl';
import fragmentShader from '../shaders/screenFrame/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

export class ScreenFrame3D extends InteractiveObject3D {
  static width = 5;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;

  constructor() {
    super();
    this._drawScreenFrame();
  }

  _drawScreenFrame() {
    this._geometry = new THREE.PlaneBufferGeometry(ScreenFrame3D.width, ScreenFrame3D.width);
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
