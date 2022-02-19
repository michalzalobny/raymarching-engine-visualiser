import React, { useEffect, useRef, useState } from 'react';

import * as S from './Visualiser.styles';
import { appState } from './Visualiser.state';
import { App } from './classes/App';

export const Visualiser = () => {
  const rendererEl = useRef<HTMLDivElement>(null);
  const [shouldUncover, setShouldUncover] = useState(false);

  useEffect(() => {
    if (!rendererEl.current) return;

    appState.app = new App({ rendererEl: rendererEl.current, setShouldUncover });

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
        <S.ReadyWrapper isLoaded={shouldUncover} />
        <S.CanvasWrapper ref={rendererEl} />
      </S.Wrapper>
    </>
  );
};
