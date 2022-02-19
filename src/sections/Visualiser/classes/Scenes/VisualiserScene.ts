import * as THREE from 'three';

import { MouseMove } from 'utils/singletons/MouseMove';

import { InteractiveScene } from './InteractiveScene';
import { Floor3D } from '../Components/Floor3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
}

export class VisualiserScene extends InteractiveScene {
  _floor3D = new Floor3D();

  constructor({ camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });

    this.add(this._floor3D);
  }

  animateIn() {
    console.log('animated in');
  }

  destroy() {
    this._floor3D.destroy();
    this.remove(this._floor3D);
  }
}
