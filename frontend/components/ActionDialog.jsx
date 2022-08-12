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
  RcIconButton,
} from '@ringcentral/juno';
import { Close } from '@ringcentral/juno-icon';

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

const CloseButton = styled(RcIconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;

export function ActionDialog({
  open,
  onClose,
  actions,
  allNodes,
  editingActionNodeId,
  onSave,
}) {
  const [parentNodeId, setParentNodeId] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (!editingActionNodeId || !open) {
      setType('');
      setParentNodeId('');
      return;
    }
    const editingActionNode = allNodes.find(node => node.id === editingActionNodeId);
    setType(editingActionNode.data.type);
    setParentNodeId(editingActionNode.data.parentNodeId);
  }, [editingActionNodeId, open]);

  return (
    <RcDialog
      open={open}
      onClose={onClose}
    >
      <RcDialogTitle>Action node</RcDialogTitle>
      <RcDialogContent>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Previous node</Label>
          <Select
            value={parentNodeId}
            onChange={(e) => setParentNodeId(e.target.value)}
            placeholder="Select previous node"
            disabled={!!editingActionNodeId}
          >
            {
              allNodes.filter(
                (node) => (node.type === 'trigger'  || node.type === 'condition')
              ).map(previousNode => (
                <RcMenuItem key={previousNode.id} value={previousNode.id}>
                  {previousNode.data.label}
                </RcMenuItem>
              ))
            }
          </Select>
        </InputLine>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Type</Label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Select action type"
          >
            {
              actions.map(action => (
                <RcMenuItem key={action.id} value={action.id}>
                  {action.name}
                </RcMenuItem>
              ))
            }
          </Select>
        </InputLine>
      </RcDialogContent>
      <RcDialogActions>
        {
          editingActionNodeId && (
            <RcButton
              variant="outlined"
              color="danger.b04"
            >
              Delete
            </RcButton>
          )
        }
        <RcButton
          onClick={() => {
            onSave({
              type,
              parentNodeId,
            });
          }}
          disabled={!type}
        >
          { editingActionNodeId ? 'Save' : 'Add' }
        </RcButton>
      </RcDialogActions>
      <CloseButton
        symbol={Close}
        onClick={onClose}
      />
    </RcDialog>
  );
}
