import React, { useState } from 'react';
import {
  RcList,
  RcListItem,
  RcListItemText,
  RcListItemSecondaryAction,
  RcIconButton,
  RcSwitch,
} from '@ringcentral/juno';
import { styled } from '@ringcentral/juno/foundation';
import { Edit, Delete } from '@ringcentral/juno-icon';

import { ConfirmDialog } from './ConfirmDialog';

const Item = styled(RcListItem)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

function FlowItem({
  flow,
  onEdit,
  onDelete,
  onToggle,
}) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  return (
    <Item
      divider
    >
      <RcListItemText primary={flow.name} />
      <RcListItemSecondaryAction>
        <RcSwitch
          checked={flow.enabled}
          onChange={(e, checked) => {
            onToggle(checked);
          }}
        />
        {
          !flow.enabled && (
            <>
              <RcIconButton
                symbol={Edit}
                size="small"
                onClick={onEdit}
              />
              <RcIconButton
                symbol={Delete}
                size="small"
                onClick={() => setConfirmDialogOpen(true)}
                color="danger.b04"
              />
            </>
          )
        }
      </RcListItemSecondaryAction>
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
        }}
        title="Are you sure to delete this flow?"
        onConfirm={() => {
          setConfirmDialogOpen(false);
          onDelete();
        }}
      />
    </Item>
  );
}

export function FlowList({
  onEdit,
  flows,
  onDelete,
  onToggle,
}) {
  return (
    <RcList>
      {
        flows.map(flow => (
          <FlowItem
            key={flow.id}
            flow={flow}
            onEdit={() => onEdit(flow.id)}
            onDelete={() => onDelete(flow.id)}
            onToggle={(enabled) => onToggle(flow.id, enabled)}
          />
        ))
      }
    </RcList>
  );
};
