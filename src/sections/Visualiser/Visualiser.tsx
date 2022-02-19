import React, { useEffect, useRef, useState } from 'react';

import * as S from './Visualiser.styles';
import { appState } from './Visualiser.state';
import { App } from './classes/App';

export const Visualiser = () => {
  const rendererWrapperEl = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!rendererWrapperEl.current) return;

    appState.app = new App({ rendererWrapperEl: rendererWrapperEl.current, setIsLoaded });

    return () => {
      if (appState.app) {
        appState.app.destroy();
        appState.app = null;
      }
    };
  }, []);

  return (
    <>
      <S.Wrapper>
        <S.ReadyWrapper isLoaded={isLoaded} />
        <S.CanvasWrapper ref={rendererWrapperEl} />
      </S.Wrapper>
    </>
  );
};
