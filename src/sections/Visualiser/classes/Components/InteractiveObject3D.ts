import * as THREE from 'three';

export type ColliderName = 'sceneItem';

export class InteractiveObject3D extends THREE.Object3D {
  colliderName: ColliderName | null = null;
  _isHovered = false;

  constructor() {
    super();
  }

  setColliderName(name: ColliderName) {
    this.colliderName = name;
  }

  onMouseEnter() {
    this._isHovered = true;
    this.dispatchEvent({ type: 'mouseenter' });
  }

  onMouseLeave() {
    this._isHovered = false;
    this.dispatchEvent({ type: 'mouseleave' });
  }

  onClick() {
    this.dispatchEvent({ type: 'click' });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy() {}
}
