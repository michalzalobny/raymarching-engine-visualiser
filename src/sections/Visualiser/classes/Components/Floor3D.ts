import * as THREE from 'three';

import vertexShader from '../shaders/floor/vertex.glsl';
import fragmentShader from '../shaders/floor/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

export class Floor3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;

  constructor() {
    super();
    this._drawFloor();
  }

  _drawFloor() {
    this._geometry = new THREE.PlaneBufferGeometry(8, 8, 10, 10);
    this._material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uRandom: { value: Math.random() },
      },
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);

    this._mesh.rotation.x = -Math.PI * 0.5;
    this._mesh.position.y = 0;

    this.add(this._mesh);
  }

  update() {
    super.update();
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
