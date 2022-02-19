import * as THREE from 'three';

import { MouseMove } from 'utils/singletons/MouseMove';

import { InteractiveScene } from './InteractiveScene';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
}

export class VisualiserScene extends InteractiveScene {
  constructor({ camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });
  }

  animateIn() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.add(cube);
  }
}
