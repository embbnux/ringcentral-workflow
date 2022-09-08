import React, { useState } from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcButton,
  RcDialog,
  RcDialogContent,
  RcDialogActions,
  RcDialogTitle,
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

const CloseButton = styled(RcIconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;

export function ExitNodeDialog({
  open,
  onClose,
  allNodes,
  onSave,
}) {
  const [parentNodeId, setParentNodeId] = useState('');
  const [parentNodeBranch, setParentNodeBranch] = useState('default');

  return (
    <RcDialog
      open={open}
      onClose={onClose}
    >
      <RcDialogTitle>New Exit node</RcDialogTitle>
      <RcDialogContent>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Previous node</Label>
          <ParentNodeInput
            parentNodeId={parentNodeId}
            parentNodeBranch={parentNodeBranch}
            onParentNodeIdChange={(e) => setParentNodeId(e.target.value)}
            onParentNodeBranchChange={(e) => setParentNodeBranch(e.target.value)}
            parentNodes={
              allNodes.filter(
                (node) => (node.type === 'condition')
              )
            }
          />
        </InputLine>
      </RcDialogContent>
      <RcDialogActions>
        <RcButton
          onClick={() => {
            onSave({
              parentNodeId,
              parentNodeBranch,
            });
          }}
          disabled={!parentNodeId || !parentNodeBranch}
        >
          Add
        </RcButton>
      </RcDialogActions>
      <CloseButton
        symbol={Close}
        onClick={onClose}
      />
    </RcDialog>
  );
}
