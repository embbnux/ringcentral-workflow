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
import { ParentNodeInput } from './ParentNodeInput';

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
  selectedBlankNode,
  onSave,
  onDelete,
}) {
  const [parentNodeId, setParentNodeId] = useState(null);
  const [parentNodeBranch, setParentNodeBranch] = useState('default');
  const [type, setType] = useState('');

  useEffect(() => {
    if (!editingActionNodeId || !open) {
      setType('');
      if (selectedBlankNode) {
        setParentNodeId(selectedBlankNode.data.parentNodeId);
        setParentNodeBranch(selectedBlankNode.data.parentNodeBranch);
      } else {
        setParentNodeId('');
        setParentNodeBranch('');
      }
      return;
    }
    const editingActionNode = allNodes.find(node => node.id === editingActionNodeId);
    setType(editingActionNode.data.type);
    setParentNodeId(editingActionNode.data.parentNodeId);
    setParentNodeBranch(editingActionNode.data.parentNodeBranch);
  }, [editingActionNodeId, open, selectedBlankNode]);

  const parentNode = allNodes.find(node => node.id === parentNodeId);
  const action = actions.find(action => action.id === type);

  return (
    <RcDialog
      open={open}
      onClose={onClose}
    >
      <RcDialogTitle>Action node</RcDialogTitle>
      <RcDialogContent>
        {
          (selectedBlankNode || editingActionNodeId) ? null : (
            <InputLine>
              <Label color="neutral.f06" variant="body2">Previous node</Label>
              <ParentNodeInput
                parentNodeId={parentNodeId}
                parentNodeBranch={parentNodeBranch}
                onParentNodeIdChange={(e) => setParentNodeId(e.target.value)}
                onParentNodeBranchChange={(e) => setParentNodeBranch(e.target.value)}
                parentNodes={
                  allNodes.filter(
                    (node) => (node.type === 'trigger'  || node.type === 'condition')
                  )
                }
              />
            </InputLine>
          )
        }
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
              onClick={() => onDelete(editingActionNodeId)}
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
              parentNodeBranch,
            });
          }}
          disabled={!type || (!parentNodeId && !selectedBlankNode)}
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
