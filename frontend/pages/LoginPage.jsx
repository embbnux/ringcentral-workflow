import React from 'react';

import { styled } from '@ringcentral/juno/foundation';
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

export function LoginPage() {
  return (
    <Container>
      <Title variant="subheading2">
        RingCentral Workflow Lab
      </Title>
      <RcButton
        onClick={() => {
          window.location.href = '/oauth/authorize';
        }}
      >
        Login with RingCentral account
      </RcButton>
    </Container>
  );
}
