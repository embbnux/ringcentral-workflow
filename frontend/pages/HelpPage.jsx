import React from 'react';
import { styled } from '@ringcentral/juno/foundation';
import { RcTypography } from '@ringcentral/juno';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
`;

export function HelpPage() {
  return (
    <Container>
      <RcTypography variant="headline2">Help</RcTypography>
    </Container>
  );
}
