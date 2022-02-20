import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

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
  controls: OrbitControls;
  gui: GUI;
}

export class VisualiserScene extends InteractiveScene {
  _controls: OrbitControls;
  _floor3D = new Floor3D();
  _screenFrame3D = new ScreenFrame3D();
  _screenComputed3D = new ScreenComputed3D();
  _raySphere3D1 = new RaySphere3D();
  _raySphere3D2 = new RaySphere3D();
  _rayLight = new RayLight3D();
  _raymarchSettings: RaymarchSettings = {
    ro: new THREE.Vector3(0, 4, -9.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    zoom: 1.0,
    lightPos: new THREE.Vector3(0.0, 12.0, -5.0),
    lightColor: [0.92, 0.684, 0.99],
    sphere1: new THREE.Vector3(1.0, 3.4, 4.0),
    sphere2: new THREE.Vector3(-1.0, 1.0, 4.0),
  };
  _gui: GUI;

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });

    this._controls = controls;
    this._gui = gui;

    this.add(this._floor3D);
    this.add(this._screenFrame3D);
    this.add(this._screenComputed3D);
    this.add(this._raySphere3D1);
    this.add(this._raySphere3D2);
    this.add(this._rayLight);

    this._screenComputed3D.setRaymarchSettingsRef(this._raymarchSettings);
    this._screenFrame3D.setRaymarchSettingsRef(this._raymarchSettings);

    this._addGuiControls();
  }

  _addGuiControls() {
    const camera = this._gui.addFolder('Camera');
    const light = this._gui.addFolder('Light');
    light.addColor(this._raymarchSettings, 'lightColor', 1).name('Color');
    camera.add(this._raymarchSettings, 'zoom', 0, 10).name('Zoom');
    const cameraPosition = camera.addFolder('Camera position');
    const lookAtPosition = camera.addFolder('Look at position');
    const lightPosition = light.addFolder('Light position');
    const sphere1Position = this._gui.addFolder('Sphere 1 position');

    cameraPosition.add(this._raymarchSettings.ro, 'x', -8, 8).name('X');
    cameraPosition.add(this._raymarchSettings.ro, 'y', 0, 10).name('Y');
    cameraPosition.add(this._raymarchSettings.ro, 'z', -10, 0).name('Z');

    lookAtPosition.add(this._raymarchSettings.lookAt, 'x', -10, 10).name('X');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'y', -10, 10).name('Y');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'z', -10, 10).name('Z');

    lightPosition.add(this._raymarchSettings.lightPos, 'x', -10, 10).name('X');
    lightPosition.add(this._raymarchSettings.lightPos, 'y', -10, 10).name('Y');
    lightPosition.add(this._raymarchSettings.lightPos, 'z', -10, 10).name('Z');

    sphere1Position.add(this._raymarchSettings.sphere1, 'x', -10, 10).name('X');
    sphere1Position.add(this._raymarchSettings.sphere1, 'y', -10, 10).name('Y');
    sphere1Position.add(this._raymarchSettings.sphere1, 'z', -10, 10).name('Z');
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
    this._raySphere3D2.update(updateInfo);
    this._rayLight.update(updateInfo);

    this._raymarchSettings.sphere1.x += Math.sin(updateInfo.time * 0.003) * 0.01;
    this._raymarchSettings.sphere1.z += Math.cos(updateInfo.time * 0.003) * 0.01;

    this._rayLight.setElPosition(this._raymarchSettings.lightPos);
    this._rayLight.setLightColor(this._raymarchSettings.lightColor);

    this._raySphere3D1.setElPosition(this._raymarchSettings.sphere1);
    this._raySphere3D2.setElPosition(this._raymarchSettings.sphere2);
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

    this._raySphere3D2.destroy();
    this.remove(this._raySphere3D2);

    this._rayLight.destroy();
    this.remove(this._rayLight);
  }
}
