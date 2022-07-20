import React from 'react';

import { styled, palette2 } from '@ringcentral/juno/foundation';

import { LoginPanel } from './LoginPanel';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${palette2('nav', 'b01')};
`;

export function Root() {
  return (
    <Container>
      <LoginPanel />
    </Container>
  );
}
