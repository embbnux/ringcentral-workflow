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
  RcTextField,
} from '@ringcentral/juno';

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const Label = styled(RcTypography)`
  margin-right: 20px;
  width: 100px;
`;

const Select = styled(RcSelect)`
  min-width: 200px;
`;

export function ConditionDialog({
  open,
  onClose,
  conditions,
  editingConditionNodeId,
  allNodes,
  getPreviousOutputs,
  onSave,
}) {
  const [parentNodeId, setParentNodeId] = useState('');
  const [nodeLabel, setNodeLabel] = useState('');

  useEffect(() => {
    if (!editingConditionNodeId || !open) {
      setParentNodeId('');
      setNodeLabel('');
      return;
    }
    const editingConditionNode = allNodes.find(node => node.id === editingConditionNodeId);
    setParentNodeId(editingConditionNode.data.parentNodeId);
    setNodeLabel(editingConditionNode.data.label);
  }, [editingConditionNodeId, open]);

  return (
    <RcDialog
      open={open}
      onClose={onClose}
    >
      <RcDialogTitle>Condition node</RcDialogTitle>
      <RcDialogContent>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Node name</Label>
          <RcTextField
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            clearBtn={false}
            placeholder="Enter node name"
          />
        </InputLine>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Previous node</Label>
          <Select
            value={parentNodeId}
            onChange={(e) => setParentNodeId(e.target.value)}
            placeholder="Select previous node"
            disabled={!!editingConditionNodeId}
          >
            {
              allNodes.map(previousNode => (
                <RcMenuItem key={previousNode.id} value={previousNode.id}>
                  {previousNode.data.label}
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
          onClick={() => {
            onSave({
              parentNodeId,
              label: nodeLabel,
            });
          }}
          disabled={!parentNodeId || !nodeLabel}
        >
          { editingConditionNodeId ? 'Save' : 'Add' }
        </RcButton>
      </RcDialogActions>
    </RcDialog>
  );
}
