import React from 'react';
import {
  RcAppBar,
  RcTypography,
  RcButton,
  RcText,
  RcDivider,
  RcGrid,
} from '@ringcentral/juno';

import { styled } from '@ringcentral/juno/foundation';

const StyledAppBar = styled(RcAppBar)`
  padding: 0 30px;
  min-height: 56px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: none;
  height: auto;
`;

const Title = styled(RcTypography)`
  margin-right: 10px;
  line-height: 36px;
  font-weight: bold;
`;

const RightNavWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 36px;
`;

const StyledDivider = styled(RcDivider)`
  margin: 0 5px;
  height: 15px;
`;

const LeftNavGroup = styled(RcGrid)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 36px;
`;

function UserInfo({ username, onLogout }) {
  if (!username) {
    return null;
  }
  return (
    <RightNavWrapper>
      <RcText weight="bold" color="header.text">{username}</RcText>
      <StyledDivider vertical />
      <RcButton
        onClick={onLogout}
        variant="plain"
        color="header.text"
      >
        Logout
      </RcButton>
    </RightNavWrapper>
  );
}

export function AppBar({
  username = '',
  onLogout,
}) {
  return (
    <StyledAppBar position="fixed">
      <RcGrid
        container
        spacing={0}
        direction="row"
        wrap="wrap"
      >
        <LeftNavGroup item xs={8}>
          <Title variant="title1" color="header.text" noWrap>
            RingCentral Workflow Lab
          </Title>
        </LeftNavGroup>
        <RcGrid item xs={4}>
          <UserInfo username={username} onLogout={onLogout} />
        </RcGrid>
      </RcGrid>
    </StyledAppBar>
  );
};
