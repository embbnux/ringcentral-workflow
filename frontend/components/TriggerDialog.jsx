import React, { useEffect, useState } from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcButton,
  RcDialog,
  RcDialogContent,
  RcDialogActions,
  RcDialogTitle,
  RcSelect,
  RcMenuItem,
  RcTypography,
} from '@ringcentral/juno';

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const Label = styled(RcTypography)`
  margin-right: 20px;
`;

const Select = styled(RcSelect)`
  min-width: 200px;
`;

export function TriggerDialog({
  open,
  onClose,
  triggers,
  editingTriggerNode,
  onSave,
}) {
  const [type, setType] = useState('');

  useEffect(() => {
    if (!editingTriggerNode) {
      setType('');
      return;
    }
    setType(editingTriggerNode.data.type);
  }, [editingTriggerNode]);

  return (
    <RcDialog
      open={open}
      onClose={onClose}
    >
      <RcDialogTitle>Trigger node</RcDialogTitle>
      <RcDialogContent>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Type</Label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Select trigger type"
          >
            {
              triggers.map(trigger => (
                <RcMenuItem key={trigger.id} value={trigger.id}>
                  {trigger.name}
                </RcMenuItem>
              ))
            }
          </Select>
        </InputLine>
      </RcDialogContent>
      <RcDialogActions>
        <RcButton variant="outlined" onClick={onClose}>
          Close
        </RcButton>
        <RcButton
          onClick={() => { onSave(type); }}
          disabled={!type}
        >
          { editingTriggerNode ? 'Save' : 'Add' }
        </RcButton>
      </RcDialogActions>
    </RcDialog>
  );
}
