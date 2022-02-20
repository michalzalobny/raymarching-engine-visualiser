import * as THREE from 'three';

import { MouseMove } from 'utils/singletons/MouseMove';
import { UpdateInfo, RaymarchSettings } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { Floor3D } from '../Components/Floor3D';
import { ScreenFrame3D } from '../Components/ScreenFrame3D';
import { ScreenComputed3D } from '../Components/ScreenComputed3D';
import { RaySphere3D } from '../Components/RaymarchedComponents/RaySphere3D';
import { RayLight3D } from '../Components/RaymarchedComponents/RayLight3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
}

export class VisualiserScene extends InteractiveScene {
  _floor3D = new Floor3D();
  _screenFrame3D = new ScreenFrame3D();
  _screenComputed3D = new ScreenComputed3D();
  _raySphere3D1 = new RaySphere3D();
  _rayLight = new RayLight3D();
  _raymarchSettings: RaymarchSettings = {
    ro: new THREE.Vector3(0.0, 3.0, -10.0),
  };

  constructor({ camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });

    this.add(this._floor3D);
    this.add(this._screenFrame3D);
    this.add(this._screenComputed3D);
    this.add(this._raySphere3D1);
    this.add(this._rayLight);

    this._screenComputed3D.setRaymarchSettingsRef(this._raymarchSettings);
  }

  animateIn() {
    console.log('animated in');
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    this._floor3D.update(updateInfo);
    this._screenFrame3D.update(updateInfo);
    this._screenComputed3D.update(updateInfo);
    this._raySphere3D1.update(updateInfo);
    this._rayLight.update(updateInfo);
  }

  destroy() {
    this._floor3D.destroy();
    this.remove(this._floor3D);

    this._screenFrame3D.destroy();
    this.remove(this._screenFrame3D);

    this._screenComputed3D.destroy();
    this.remove(this._screenComputed3D);

    this._raySphere3D1.destroy();
    this.remove(this._raySphere3D1);

    this._rayLight.destroy();
    this.remove(this._rayLight);
  }
}