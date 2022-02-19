export interface Size {
  clientRect: DomRectSSR;
  offsetTop: number;
  isReady: boolean;
}

export interface DomRectSSR {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

export interface UpdateInfo {
  slowDownFactor: number;
  delta: number;
  time: number;
}

export interface AnimateProps {
  duration?: number;
  delay?: number;
  destination: number;
  easing?: (amount: number) => number;
}
