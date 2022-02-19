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

  animateIn() {}
}
