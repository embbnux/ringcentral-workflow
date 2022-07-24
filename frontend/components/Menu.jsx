import React from 'react';
import {
  RcDrawer,
  RcMenuList,
  RcListItem,
  RcListItemText,
} from '@ringcentral/juno';
import { RcDrawerClasses } from '@ringcentral/juno/components/Drawer/utils';

import { styled } from '@ringcentral/juno/foundation';

const StyledDrawer = styled(RcDrawer)`
  height: 100%;

  .${RcDrawerClasses.paper} {
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
`;

const MenuItem = styled(RcListItem)`
  height: 36px;
  line-height: 36px;
  width: 200px;
`;

export function Menu({
  navigate,
}) {
  return (
    <StyledDrawer
      variant="permanent"
      radius="zero"
      role="navigation"
    >
      <RcMenuList
        role="tablist"
      >
        <MenuItem
          onClick={() => navigate('/home')}
          selected
        >
          <RcListItemText primary="Home" />
        </MenuItem>
      </RcMenuList>
    </StyledDrawer>
  );
};
