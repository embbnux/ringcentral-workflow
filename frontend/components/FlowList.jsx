import React from 'react';
import {
  RcList,
  RcListItem,
  RcListItemText,
  RcListItemSecondaryAction,
  RcIconButton,
} from '@ringcentral/juno';
import { styled } from '@ringcentral/juno/foundation';
import { Edit } from '@ringcentral/juno-icon';

const Item = styled(RcListItem)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export function FlowList({
  navigate,
  flows,
}) {
  return (
    <RcList>
      {
        flows.map(flow => (
          <Item
            key={flow.id}
            onClick={() => navigate(`/app/flows/${flow.id}`)}
            divider
          >
            <RcListItemText primary={flow.name} />
            <RcListItemSecondaryAction>
              <RcIconButton
                symbol={Edit}
                size="small"
              />
            </RcListItemSecondaryAction>
          </Item>
        ))
      }
    </RcList>
  );
};
