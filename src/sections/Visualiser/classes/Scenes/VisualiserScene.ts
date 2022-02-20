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
import { LabeledSphere3D } from '../Components/LabeledSphere3D';
import { RayBox3D } from '../Components/RaymarchedComponents/RayBox3D';

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
  _raySphere3D = new RaySphere3D();
  _rayBox3D = new RayBox3D();
  _rayLight = new RayLight3D();
  _raymarchSettings: RaymarchSettings = {
    ro: new THREE.Vector3(0, 4, -9.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    zoom: 1.0,
    lightPos: new THREE.Vector3(6.0, 7.5, -2.0),
    lightColor: [0.92, 0.684, 0.99],
    sphere: new THREE.Vector3(1.0, 3.4, 4.0),
    box: new THREE.Vector3(1.0, 0.9, 4.0),
    raySmooth: 0.0,
  };
  _gui: GUI;
  _line3D = new Line3D();
  _lookAtLabel3D = new LabeledSphere3D({ size: 0.1, color: new THREE.Color('#00ff00') });

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });

    this._controls = controls;
    this._gui = gui;

    this.add(this._floor3D);
    this.add(this._screenFrame3D);
    this.add(this._screenComputed3D);
    this.add(this._raySphere3D);
    this.add(this._rayBox3D);
    this.add(this._rayLight);
    this.add(this._line3D);
    this.add(this._lookAtLabel3D);

    this._screenComputed3D.setRaymarchSettingsRef(this._raymarchSettings);
    this._screenFrame3D.setRaymarchSettingsRef(this._raymarchSettings);

    this._addGuiControls();
  }

  _addGuiControls() {
    //Camera
    const camera = this._gui.addFolder('Camera');
    camera.close();
    camera.add(this._raymarchSettings, 'zoom', 1, 4).name('Zoom');
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
    light.close();
    light.addColor(this._raymarchSettings, 'lightColor', 1).name('Color');
    const lightPosition = light.addFolder('Light position');
    lightPosition.add(this._raymarchSettings.lightPos, 'x', -10, 10).name('X');
    lightPosition.add(this._raymarchSettings.lightPos, 'y', -10, 10).name('Y');
    lightPosition.add(this._raymarchSettings.lightPos, 'z', -10, 10).name('Z');

    //Objects3D
    const objects3D = this._gui.addFolder('3D Objects');
    objects3D.close();
    const spherePosition = objects3D.addFolder('Sphere position');
    spherePosition.add(this._raymarchSettings.sphere, 'x', -10, 10).name('X');
    spherePosition.add(this._raymarchSettings.sphere, 'y', -10, 10).name('Y');
    spherePosition.add(this._raymarchSettings.sphere, 'z', -10, 10).name('Z');
    const boxPosition = objects3D.addFolder('Box position');
    boxPosition.add(this._raymarchSettings.box, 'x', -10, 10).name('X');
    boxPosition.add(this._raymarchSettings.box, 'y', -10, 10).name('Y');
    boxPosition.add(this._raymarchSettings.box, 'z', -10, 10).name('Z');

    //Shader
    this._gui.add(this._raymarchSettings, 'raySmooth', 0, 1).name('Raymarch smooth');
  }

  animateIn() {
    console.log('animated in');
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    this._floor3D.update(updateInfo);
    this._screenFrame3D.update(updateInfo);
    this._screenComputed3D.update(updateInfo);
    this._raySphere3D.update(updateInfo);
    this._rayBox3D.update(updateInfo);
    this._rayLight.update(updateInfo);

    this._raymarchSettings.sphere.x += Math.sin(updateInfo.time * 0.003) * 0.01;
    this._raymarchSettings.sphere.z += Math.cos(updateInfo.time * 0.003) * 0.01;

    this._rayLight.setElPosition(this._raymarchSettings.lightPos);
    this._rayLight.setLightColor(this._raymarchSettings.lightColor);

    this._raySphere3D.setElPosition(this._raymarchSettings.sphere);
    this._rayBox3D.setElPosition(this._raymarchSettings.box);

    this._lookAtLabel3D.setElPosition(
      new THREE.Vector3(
        this._raymarchSettings.lookAt.x,
        this._raymarchSettings.lookAt.y,
        -this._raymarchSettings.lookAt.z
      )
    );

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

    this._raySphere3D.destroy();
    this.remove(this._raySphere3D);

    this._rayBox3D.destroy();
    this.remove(this._rayBox3D);

    this._rayLight.destroy();
    this.remove(this._rayLight);

    this._line3D.destroy();
    this.remove(this._line3D);

    this._lookAtLabel3D.destroy();
    this.remove(this._lookAtLabel3D);
  }
}
