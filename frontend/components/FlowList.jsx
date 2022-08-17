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
import { Edit, Delete, ViewBorder } from '@ringcentral/juno-icon';

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
        <RcIconButton
          symbol={flow.enabled ? ViewBorder : Edit}
          size="small"
          onClick={onEdit}
        />
        {
          !flow.enabled && (
            <RcIconButton
              symbol={Delete}
              size="small"
              onClick={() => setConfirmDialogOpen(true)}
              color="danger.b04"
            />
          )
        }
        <RcSwitch
          checked={flow.enabled}
          onChange={(e, checked) => {
            onToggle(checked);
          }}
        />
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
