import React from 'react';
import {
  RcDrawer,
  RcMenuList,
  RcMenuItem,
  RcListItemText,
} from '@ringcentral/juno';
import { RcDrawerClasses } from '@ringcentral/juno/components/Drawer/utils';

import { styled, setOpacity, palette2 } from '@ringcentral/juno/foundation';

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

const MenuItem = styled(RcMenuItem)`
  height: 36px;
  line-height: 36px;
  width: 200px;

  &:hover {
    cursor: pointer;
    background-color: ${setOpacity(palette2('nav', 'ctlSelected'), '08')};
  }

  &.Mui-selected {
    background-color: ${setOpacity(palette2('nav', 'ctlSelected'), '80')};

    &:hover {
      background-color: ${palette2('nav', 'ctlSelected')};
    }

    .RcListItemText-primary {
      color: ${palette2('nav', 'menuText')};
    }
  }
`;

export function Menu({
  navigate,
  location,
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
          onClick={() => navigate('/app/flows')}
          selected={location.pathname.indexOf('/app/flows') > -1}
        >
          <RcListItemText primary="Home" />
        </MenuItem>
        <MenuItem
          onClick={() => navigate('/app/help')}
          selected={location.pathname === '/app/help'}
        >
          <RcListItemText primary="Help" />
        </MenuItem>
      </RcMenuList>
    </StyledDrawer>
  );
};
