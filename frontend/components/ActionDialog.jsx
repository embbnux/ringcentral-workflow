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
  RcLoading,
} from '@ringcentral/juno';
import { Close } from '@ringcentral/juno-icon';
import { ParentNodeInput } from './ParentNodeInput';
import { ActionParamsInput } from './ActionParamsInput';

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
  inputProperties,
  onLoadParamsOptions,
  loading,
}) {
  const [parentNodeId, setParentNodeId] = useState(null);
  const [parentNodeBranch, setParentNodeBranch] = useState('default');
  const [type, setType] = useState('');
  const [paramValues, setParamValues] = useState({});
  const [remoteParmaOptions, setRemoteParmaOptions] = useState({});

  useEffect(() => {
    if (!editingActionNodeId || !open) {
      setType('');
      setParamValues({});
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
    setParamValues(editingActionNode.data.paramValues);
  }, [editingActionNodeId, open, selectedBlankNode]);

  useEffect(() => {
    const initRemoteParmaOptions = async () => {
      setRemoteParmaOptions({});
      if (!type) {
        return;
      }
      const action = actions.find(action => action.id === type);
      const needToLoadParams = !!action.params.find(param =>
        param.type === 'option' && param.remote
      );
      if (needToLoadParams) {
        const newParamsOptions = await onLoadParamsOptions(type);
        setRemoteParmaOptions(newParamsOptions);
      }
    };
    initRemoteParmaOptions();
  }, [type]);

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
            onChange={(e) => {
              setType(e.target.value);
              setParamValues({});
            }}
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
        <RcLoading loading={loading}>
          <ActionParamsInput
            action={action}
            values={paramValues}
            setValues={setParamValues}
            inputProperties={inputProperties}
            remoteOptions={remoteParmaOptions}
          />
        </RcLoading>
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
              paramValues,
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
