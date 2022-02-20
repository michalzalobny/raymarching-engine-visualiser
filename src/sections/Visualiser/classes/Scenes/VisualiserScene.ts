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
import { Line3D } from '../Components/Line3D';

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
  _line3D = new Line3D();

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
    this.add(this._line3D);

    this._screenComputed3D.setRaymarchSettingsRef(this._raymarchSettings);
    this._screenFrame3D.setRaymarchSettingsRef(this._raymarchSettings);

    this._addGuiControls();
  }

  _addGuiControls() {
    //Camera
    const camera = this._gui.addFolder('Camera');
    camera.add(this._raymarchSettings, 'zoom', 0, 10).name('Zoom');
    const lookAtPosition = camera.addFolder('Look at position');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'x', -20, 20).name('X');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'y', -20, 20).name('Y');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'z', -20, 20).name('Z');
    const cameraPosition = camera.addFolder('Camera position');
    cameraPosition.add(this._raymarchSettings.ro, 'x', -20, 20).name('X');
    cameraPosition.add(this._raymarchSettings.ro, 'y', -20, 20).name('Y');
    cameraPosition.add(this._raymarchSettings.ro, 'z', -20, 20).name('Z');

    //Light
    const light = this._gui.addFolder('Light');
    light.addColor(this._raymarchSettings, 'lightColor', 1).name('Color');
    const lightPosition = light.addFolder('Light position');
    lightPosition.add(this._raymarchSettings.lightPos, 'x', -10, 10).name('X');
    lightPosition.add(this._raymarchSettings.lightPos, 'y', -10, 10).name('Y');
    lightPosition.add(this._raymarchSettings.lightPos, 'z', -10, 10).name('Z');

    //Objects3D
    const objects3D = this._gui.addFolder('3D Objects');
    const sphere1Position = objects3D.addFolder('Sphere 1 position');
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

    this._line3D.updateLinePos(
      new THREE.Vector3(
        this._raymarchSettings.ro.x,
        this._raymarchSettings.ro.y,
        -this._raymarchSettings.ro.z
      ),
      new THREE.Vector3(
        this._raymarchSettings.lookAt.x,
        this._raymarchSettings.lookAt.y,
        -this._raymarchSettings.lookAt.z
      )
    );
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

    this._line3D.destroy();
    this.remove(this._line3D);
  }
}
