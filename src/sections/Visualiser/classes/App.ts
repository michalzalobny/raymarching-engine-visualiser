import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import debounce from 'lodash.debounce';
import { OrbitControls } from 'three-stdlib';

import { MouseMove } from 'utils/singletons/MouseMove';
import { Scroll } from 'utils/singletons/Scroll';
import { sharedValues } from 'utils/sharedValues';

import { Preloader } from './utility/Preloader';
import { VisualiserScene } from './Scenes/VisualiserScene';

interface Constructor {
  rendererEl: HTMLDivElement;
  setShouldUncover: React.Dispatch<React.SetStateAction<boolean>>;
}

export class App extends THREE.EventDispatcher {
  _rendererEl: HTMLDivElement;
  _rafId: number | null = null;
  _isResumed = true;
  _lastFrameTime: number | null = null;
  _canvas: HTMLCanvasElement;
  _camera: THREE.PerspectiveCamera;
  _renderer: THREE.WebGLRenderer;
  _mouseMove = MouseMove.getInstance();
  _scroll = Scroll.getInstance();
  _preloader = new Preloader();
  _controls: OrbitControls;
  _visualiserScene: VisualiserScene;
  _setShouldUncoverReact: React.Dispatch<React.SetStateAction<boolean>>;

  constructor({ setShouldUncover, rendererEl }: Constructor) {
    super();
    this._rendererEl = rendererEl;
    this._canvas = document.createElement('canvas');
    this._rendererEl.appendChild(this._canvas);
    this._camera = new THREE.PerspectiveCamera();

    this._setShouldUncoverReact = setShouldUncover;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
    });

    this._renderer.shadowMap.enabled = true;

    this._visualiserScene = new VisualiserScene({
      camera: this._camera,
      mouseMove: this._mouseMove,
    });

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();

    this._controls = new OrbitControls(this._camera, this._rendererEl);
    this._controls.enableDamping = true;
    this._controls.update();

    this._preloader.setPreloadItems([]);
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    const rendererBounds = this._rendererEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this._camera.aspect = aspectRatio;

    this._camera.position.z = 10;
    this._camera.position.y = 10;

    this._renderer.setSize(rendererBounds.width, rendererBounds.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._camera.updateProjectionMatrix();

    this._visualiserScene.rendererBounds = rendererBounds;
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      this._stopAppFrame();
    } else {
      this._resumeAppFrame();
    }
  };

  _onAssetsLoaded = (e: THREE.Event) => {
    this._setShouldUncoverReact(true);
    this._visualiserScene.animateIn();
  };

  _addListeners() {
    window.addEventListener('resize', this._onResizeDebounced);
    window.addEventListener('visibilitychange', this._onVisibilityChange);
    this._preloader.addEventListener('loaded', this._onAssetsLoaded);
  }

  _removeListeners() {
    window.removeEventListener('resize', this._onResizeDebounced);
    window.removeEventListener('visibilitychange', this._onVisibilityChange);
    this._preloader.removeEventListener('loaded', this._onAssetsLoaded);
  }

  _resumeAppFrame() {
    this._rafId = window.requestAnimationFrame(this._renderOnFrame);
    this._isResumed = true;
  }

  _renderOnFrame = (time: number) => {
    this._rafId = window.requestAnimationFrame(this._renderOnFrame);

    if (this._isResumed || !this._lastFrameTime) {
      this._lastFrameTime = window.performance.now();
      this._isResumed = false;
      return;
    }

    TWEEN.update(time);

    const delta = time - this._lastFrameTime;
    let slowDownFactor = delta / sharedValues.motion.DT_FPS;

    //Rounded slowDown factor to the nearest integer reduces physics lags
    const slowDownFactorRounded = Math.round(slowDownFactor);

    if (slowDownFactorRounded >= 1) {
      slowDownFactor = slowDownFactorRounded;
    }
    this._lastFrameTime = time;

    this._mouseMove.update();
    this._scroll.update({ delta, slowDownFactor, time });
    this._visualiserScene.update({ delta, slowDownFactor, time });
    this._controls.update();

    this._renderer.render(this._visualiserScene, this._camera);
  };

  _stopAppFrame() {
    if (this._rafId) {
      window.cancelAnimationFrame(this._rafId);
    }
  }

  destroy() {
    if (this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._stopAppFrame();
    this._removeListeners();

    this._visualiserScene.destroy();
  }
}