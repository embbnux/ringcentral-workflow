import React from 'react';
import {
  RcTypography,
  RcButton,
  RcIcon,
} from '@ringcentral/juno';
import { styled } from '@ringcentral/juno/foundation';
import { Add } from '@ringcentral/juno-icon';
import { FlowList } from '../components/FlowList';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
`;

const Title = styled(RcTypography)`
  flex: 1;
`;

export function FlowsPage({
  navigate,
}) {
  return (
    <Container>
      <TitleLine>
        <Title variant="headline2">My Flows</Title>
        <RcButton
          startIcon={<RcIcon symbol={Add} />}
          variant="outlined"
          onClick={() => {
            navigate('/app/flows/new');
          }}
        >
          New flow
        </RcButton>
      </TitleLine>
      <FlowList
        navigate={navigate}
        flows={[
          {
            id: '1234',
            name: 'New SMS Flow',
          },
          {
            id: '12345',
            name: 'New Call Flow',
          },
        ]}
      />
    </Container>
  );
}
