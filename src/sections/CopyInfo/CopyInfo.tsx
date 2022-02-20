import React from 'react';

import { LinkHandler } from 'components/LinkHandler/LinkHandler';

import * as S from './CopyInfo.styles';

export const CopyInfo = () => {
  return (
    <>
      <S.GithubWrapper>
        <LinkHandler
          isExternal
          elHref="https://github.com/javusScriptus/raymarching-engine-visualiser/blob/main/src/sections/Visualiser/classes/Scenes/VisualiserScene.ts"
        >
          <S.GithubLink>GitHub repo</S.GithubLink>
        </LinkHandler>
      </S.GithubWrapper>
      <S.AuthorWrapper>
        Raymarching engine visualiser by
        <LinkHandler isExternal elHref="https://creativeprojects.vercel.app/">
          <S.AuthorLink>Michal Zalobny</S.AuthorLink>
        </LinkHandler>
      </S.AuthorWrapper>
    </>
  );
};
