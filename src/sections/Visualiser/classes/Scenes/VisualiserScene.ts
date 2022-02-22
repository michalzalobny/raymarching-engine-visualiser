import * as THREE from 'three';
import { OrbitControls, GLTF } from 'three-stdlib';
import GUI from 'lil-gui';
import TWEEN, { Tween } from '@tweenjs/tween.js';

import { MouseMove } from 'utils/singletons/MouseMove';
import { UpdateInfo, RaymarchSettings, AnimateCamera } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { Floor3D } from '../Components/Floor3D';
import { ScreenFrame3D } from '../Components/ScreenFrame3D';
import { ScreenComputed3D } from '../Components/ScreenComputed3D';
import { RaySphere3D } from '../Components/RaymarchedComponents/RaySphere3D';
import { RayLight3D } from '../Components/RaymarchedComponents/RayLight3D';
import { Line3D } from '../Components/Line3D';
import { LabeledSphere3D } from '../Components/LabeledSphere3D';
import { RayBox3D } from '../Components/RaymarchedComponents/RayBox3D';
import { RayTorus3D } from '../Components/RaymarchedComponents/RayTorus3D';
import { Model3D } from '../Components/Model3D';

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
  _raySphere3D2 = new RaySphere3D();
  _rayBox3D = new RayBox3D();
  _rayTorus3D = new RayTorus3D();
  _rayLight = new RayLight3D();
  _raymarchSettings: RaymarchSettings = {
    ro: new THREE.Vector3(2, 4, -9.0),
    lookAt: new THREE.Vector3(0.0, 1.0, 0.0),
    zoom: 1.0,
    lightPos: new THREE.Vector3(-4, 8.5, -3.5),
    lightColor: [0.75, 0.75, 0.75],
    // lightColor: [0.549, 0.725, 0.89],
    sphere: new THREE.Vector3(0.0, 3.2, 3.0),
    sphere2: new THREE.Vector3(2.0, 2.4, 3.0),
    animateSpheres: false,
    box: new THREE.Vector3(4.0, 1.0, -2.0),
    torus: new THREE.Vector3(-3.5, 0.5, -1.5),
    raySmooth: 0.0,
    isCameraFocused: false,
  };
  _gui: GUI;
  _line3D = new Line3D();
  _lookAtLabel3D = new LabeledSphere3D({
    size: 0.1,
    color: new THREE.Color('#A6CA38'),
    labelText: '(Look at)',
  });
  _cameraTween: Tween<{ cameraPosition: THREE.Vector3; cameraLookAt: THREE.Vector3 }> | null = null;
  _lastCameraSettings = {
    position: new THREE.Vector3(0, 0, 0),
  };
  _cameraModel3D = new Model3D();
  _cameraPivotGroup = new THREE.Group();

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });

    this._controls = controls;
    this._gui = gui;

    this.add(this._floor3D);
    this.add(this._screenFrame3D);
    this.add(this._screenComputed3D);
    this.add(this._raySphere3D);
    this.add(this._raySphere3D2);
    this.add(this._rayBox3D);
    this.add(this._rayTorus3D);
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
    camera.add(this._raymarchSettings, 'zoom', 0.1, 5).name('Focal length');
    camera
      .add(this._raymarchSettings, 'isCameraFocused')
      .onFinishChange((isFocused: boolean) => {
        if (isFocused) {
          this._focusCamera();
        } else {
          this._defocusCamera();
        }
      })
      .name('Focus camera');
    const lookAtPosition = camera.addFolder('Look at point position');
    lookAtPosition.close();
    lookAtPosition.add(this._raymarchSettings.lookAt, 'x', -20, 20).name('X');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'y', -20, 20).name('Y');
    lookAtPosition.add(this._raymarchSettings.lookAt, 'z', -20, 20).name('Z');
    const cameraPosition = camera.addFolder('Camera position');
    cameraPosition.close();
    cameraPosition.add(this._raymarchSettings.ro, 'x', -20, 20).name('X');
    cameraPosition.add(this._raymarchSettings.ro, 'y', -20, 20).name('Y');
    cameraPosition.add(this._raymarchSettings.ro, 'z', -20, 20).name('Z');

    //Light
    const light = this._gui.addFolder('Light');
    light.close();
    light.addColor(this._raymarchSettings, 'lightColor', 1).name('Color');
    const lightPosition = light.addFolder('Light position');
    lightPosition.close();
    lightPosition.add(this._raymarchSettings.lightPos, 'x', -15, 15).name('X');
    lightPosition.add(this._raymarchSettings.lightPos, 'y', 1, 15).name('Y');
    lightPosition.add(this._raymarchSettings.lightPos, 'z', -15, 15).name('Z');

    //Objects3D
    const objects3D = this._gui.addFolder('3D Objects');
    objects3D.close();

    objects3D.add(this._raymarchSettings, 'animateSpheres').name('Animate spheres');
    const spherePosition = objects3D.addFolder('Sphere position');
    spherePosition.close();
    spherePosition.add(this._raymarchSettings.sphere, 'x', -10, 10).name('X');
    spherePosition.add(this._raymarchSettings.sphere, 'y', -10, 10).name('Y');
    spherePosition.add(this._raymarchSettings.sphere, 'z', -10, 10).name('Z');

    const sphere2Position = objects3D.addFolder('Sphere 2 position');
    sphere2Position.close();
    sphere2Position.add(this._raymarchSettings.sphere2, 'x', -10, 10).name('X');
    sphere2Position.add(this._raymarchSettings.sphere2, 'y', -10, 10).name('Y');
    sphere2Position.add(this._raymarchSettings.sphere2, 'z', -10, 10).name('Z');

    const boxPosition = objects3D.addFolder('Box position');
    boxPosition.close();
    boxPosition.add(this._raymarchSettings.box, 'x', -10, 10).name('X');
    boxPosition.add(this._raymarchSettings.box, 'y', -10, 10).name('Y');
    boxPosition.add(this._raymarchSettings.box, 'z', -10, 10).name('Z');

    const torusPosition = objects3D.addFolder('Torus position');
    torusPosition.close();
    torusPosition.add(this._raymarchSettings.torus, 'x', -10, 10).name('X');
    torusPosition.add(this._raymarchSettings.torus, 'y', -10, 10).name('Y');
    torusPosition.add(this._raymarchSettings.torus, 'z', -10, 10).name('Z');

    //Shader
    this._gui.add(this._raymarchSettings, 'raySmooth', 0, 1).name('Raymarch smooth');
  }

  animateCamera({ lookAt, position }: AnimateCamera) {
    if (this._cameraTween) {
      this._cameraTween.stop();
    }

    const from = {
      cameraPosition: new THREE.Vector3(
        this._camera.position.x,
        this._camera.position.y,
        -this._camera.position.z
      ),
      cameraLookAt: new THREE.Vector3(
        this._controls.target.x,
        this._controls.target.y,
        -this._controls.target.z
      ),
    };

    const to = {
      cameraPosition: position,
      cameraLookAt: lookAt,
    };

    this._cameraTween = new TWEEN.Tween(from)
      .to(to, 1200)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._controls.target.set(obj.cameraLookAt.x, obj.cameraLookAt.y, -obj.cameraLookAt.z);
        this._camera.position.set(
          obj.cameraPosition.x,
          obj.cameraPosition.y,
          -obj.cameraPosition.z
        );
      });

    this._cameraTween.start();
  }

  _focusCamera() {
    this._lastCameraSettings.position = new THREE.Vector3().copy(this._camera.position);
    this.animateCamera({
      position: this._raymarchSettings.ro,
      lookAt: this._raymarchSettings.lookAt,
    });
    this._controls.enabled = false;
  }

  _defocusCamera() {
    this.animateCamera({
      position: new THREE.Vector3(
        this._lastCameraSettings.position.x,
        this._lastCameraSettings.position.y,
        -this._lastCameraSettings.position.z
      ),
      lookAt: new THREE.Vector3(0, 0, 0),
    });
    this._controls.enabled = true;
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
    this._raySphere3D2.update(updateInfo);
    this._rayBox3D.update(updateInfo);
    this._rayTorus3D.update(updateInfo);
    this._rayLight.update(updateInfo);

    if (this._raymarchSettings.animateSpheres) {
      const onOff = Math.sin(updateInfo.time * 0.002);
      const onOff2 = Math.cos(updateInfo.time * 0.002);

      this._raymarchSettings.sphere.x += onOff * 0.03;
      this._raymarchSettings.sphere.y += onOff * 0.03;
      this._raymarchSettings.sphere.z += onOff2 * 0.01;

      this._raymarchSettings.sphere2.x -= onOff2 * 0.04;
      this._raymarchSettings.sphere2.y += onOff2 * 0.02;
      this._raymarchSettings.sphere2.z -= onOff * 0.01;
    }

    this._rayLight.setElPosition(this._raymarchSettings.lightPos);
    this._rayLight.setLightColor(this._raymarchSettings.lightColor);

    this._raySphere3D.setElPosition(this._raymarchSettings.sphere);
    this._raySphere3D2.setElPosition(this._raymarchSettings.sphere2);
    this._rayBox3D.setElPosition(this._raymarchSettings.box);
    this._rayTorus3D.setElPosition(this._raymarchSettings.torus);

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

  setCameraModel(gltf: GLTF, texture: THREE.Texture) {
    const modelMaterial = new THREE.MeshMatcapMaterial();
    modelMaterial.matcap = texture;
    this._cameraModel3D.setMaterial(modelMaterial);

    gltf.scene.traverse(child => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      child.material = modelMaterial;
    });

    gltf.scene.rotation.y = -Math.PI * 0.5;
    gltf.scene.scale.set(1, 1, 1);

    const model = gltf.scene;
    this._cameraModel3D.setModel(model);
    this._cameraPivotGroup.add(this._cameraModel3D);
    this.add(this._cameraPivotGroup);
    this._screenFrame3D.setCameraModelRef(this._cameraPivotGroup);
  }

  destroy() {
    if (this._cameraModel3D) this._cameraPivotGroup.remove(this._cameraModel3D);
    this.remove(this._cameraPivotGroup);

    this._floor3D.destroy();
    this.remove(this._floor3D);

    this._screenFrame3D.destroy();
    this.remove(this._screenFrame3D);

    this._screenComputed3D.destroy();
    this.remove(this._screenComputed3D);

    this._raySphere3D.destroy();
    this.remove(this._raySphere3D);

    this._raySphere3D2.destroy();
    this.remove(this._raySphere3D2);

    this._rayBox3D.destroy();
    this.remove(this._rayBox3D);

    this._rayTorus3D.destroy();
    this.remove(this._rayTorus3D);

    this._rayLight.destroy();
    this.remove(this._rayLight);

    this._line3D.destroy();
    this.remove(this._line3D);

    this._lookAtLabel3D.destroy();
    this.remove(this._lookAtLabel3D);
  }
}
