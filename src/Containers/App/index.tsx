import React, { Fragment } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Lines from 'Common/Components/Lines';

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background: #222;
  }
`;

const Scene = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App: React.FC<{}> = () => {
  return (
    <Fragment>
      <GlobalStyles />
      <Scene>
        <Lines />
      </Scene>
    </Fragment>
  );
};

export default App;
