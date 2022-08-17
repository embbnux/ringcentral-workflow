
import React from 'react';
import { styled } from '@ringcentral/juno/foundation';

import {
  RcSelect,
  RcMenuItem,
} from '@ringcentral/juno';

const ParentNodeSelect = styled(RcSelect)`
  min-width: 300px;
`;

const BranchSelect = styled(RcSelect)`
  min-width: 150px;
`;

function ParentNodeBranchInput({
  value,
  onChange,
  parentNode,
}) {
  if (!parentNode || parentNode.type !== 'condition' || !parentNode.data.enableFalsy) {
    return null;
  }
  return (
    <BranchSelect
      value={value}
      onChange={onChange}
      placeholder="Select branch"
    >
      <RcMenuItem value="default">
        True branch
      </RcMenuItem>
      <RcMenuItem value="false">
        False branch
      </RcMenuItem>
    </BranchSelect>
  );
}

export function ParentNodeInput({
  parentNodeId,
  onParentNodeIdChange,
  parentNodeBranch,
  onParentNodeBranchChange,
  parentNodes,
}) {
  const parentNode = parentNodes.find(n => n.id === parentNodeId);
  return (
    <>
      <ParentNodeSelect
        value={parentNodeId}
        onChange={onParentNodeIdChange}
        placeholder="Select previous node"
      >
        {
          parentNodes.map(previousNode => (
            <RcMenuItem key={previousNode.id} value={previousNode.id}>
              {previousNode.data.label}
            </RcMenuItem>
          ))
        }
      </ParentNodeSelect>
      <ParentNodeBranchInput
        value={parentNodeBranch}
        onChange={onParentNodeBranchChange}
        parentNode={parentNode}
      />
    </>
  );
};
