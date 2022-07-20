import React, { useState } from 'react';

import { styled, palette2 } from '@ringcentral/juno/foundation';
import {
  RcButton,
  RcTypography,
} from '@ringcentral/juno';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Title = styled(RcTypography)`
  margin-bottom: 30px;
`;

export function LoginPanel() {
  return (
    <Container>
      <Title variant="subheading2">
        Login with RingCentral account
      </Title>
      <RcButton
        onClick={() => {
          window.location.href = '/oauth/authorize';
        }}
      >
        Login
      </RcButton>
    </Container>
  );
}
