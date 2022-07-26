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
  RcIconButton,
  RcSwitch,
} from '@ringcentral/juno';
import { Close } from '@ringcentral/juno-icon';
import { ParentNodeInput } from './ParentNodeInput';
import { DateTimeInput } from './DateTimeInput';

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const CloseButton = styled(RcIconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;

const TextField = styled(RcTextField)`
  min-width: 300px;
`;

const Label = styled(RcTypography)`
  margin-right: 20px;
  width: 100px;
`;

const RuleSelect = styled(RcSelect)`
  min-width: 170px;
  margin-right: 10px;
`;

const RuleInputSelect = styled(RuleSelect)`
  min-width: 200px;
`;

const RuleValue = styled(RcTextField)`
  min-width: 150px;
  margin-top: 5px;
`;

const RuleInputLine = styled(InputLine)`
  align-items: end;
`;

function RuleInput({
  rule,
  onUpdateRule,
  inputProperties,
  conditions,
}) {
  const selectedProperty = inputProperties.find(p => p.id === rule.input);
  const propertyType = selectedProperty ? selectedProperty.type : '';
  const conditionOptions = conditions.filter((condition) => {
    return condition.supportTypes.indexOf(propertyType) > -1;
  });
  const condition = conditions.find(c => c.id === rule.condition);
  const valueType = condition ? condition.valueType : '';

  return (
    <RuleInputLine>
      <RuleInputSelect
        value={rule.input}
        variant="outlined"
        onChange={(e) => {
          const newInput = e.target.value;
          const inputProperty = inputProperties.find(p => p.id === newInput);
          const newConditionOptions = conditions.filter((condition) => {
            return condition.supportTypes.indexOf(inputProperty.type) > -1;
          });
          onUpdateRule({ ...rule, input: newInput, condition: newConditionOptions[0].id });
        }}
      >
        {
          inputProperties.map((property) => (
            <RcMenuItem key={property.id} value={property.id}>
              {property.name}
            </RcMenuItem>
          ))
        }
      </RuleInputSelect>
      <RuleSelect
        value={rule.condition}
        variant="outlined"
        onChange={(e) => onUpdateRule({ ...rule, condition: e.target.value })}
      >
        {
          conditionOptions.map((condition) => {
            return (
              <RcMenuItem key={condition.id} value={condition.id}>
                {condition.name}
              </RcMenuItem>
            );
          })
        }
      </RuleSelect>
      {
        valueType === 'dateTime' ? (
          <DateTimeInput
            dateTime={typeof rule.value === 'string' ? new Date(rule.value) : rule.value}
            onDateTimeChange={(dateTime) => onUpdateRule({ ...rule, value: dateTime })}
          />
        ) : null
      }
      {
        valueType === 'string' ? (
          <RuleValue
            value={rule.value}
            variant="outlined"
            onChange={(e) => onUpdateRule({ ...rule, value: e.target.value })}
          />
        ) : null
      }
    </RuleInputLine>
  );
}

function getConditionDescription(rule, inputProperties, conditions) {
  const selectedProperty = inputProperties.find(p => p.id === rule.input);
  const condition = conditions.find(c => c.id === rule.condition);
  let value = rule.value;
  if (value instanceof Date) {
    value = value.toLocaleString();
  }
  return `${selectedProperty.name} ${condition.name} ${value}`;
}

export function ConditionDialog({
  open,
  onClose,
  conditions,
  inputProperties,
  editingConditionNode,
  selectedBlankNode,
  allNodes,
  onSave,
  onDelete,
}) {
  const [parentNodeId, setParentNodeId] = useState('');
  const [parentNodeBranch, setParentNodeBranch] = useState('default');
  const [nodeLabel, setNodeLabel] = useState('');
  const [rule, setRule] = useState({
    input: '',
    condition: '',
    value: '',
  });

  useEffect(() => {
    if (!editingConditionNode || !open) {
      if (selectedBlankNode) {
        setParentNodeId(selectedBlankNode.data.parentNodeId);
        setParentNodeBranch(selectedBlankNode.data.parentNodeBranch);
      } else {
        setParentNodeId('');
      }
      setNodeLabel('');
      const defaultProperty = inputProperties[0];
      let defaultCondition;
      if (defaultProperty) {
        defaultCondition = conditions.find((condition) => {
          return condition.supportTypes.indexOf(defaultProperty.type) > -1;
        });
      }
      setRule({
        id: 1,
        input: defaultProperty ? defaultProperty.id : '',
        condition: defaultCondition ? defaultCondition.id : '',
        value: '',
      });
      return;
    }
    setParentNodeId(editingConditionNode.data.parentNodeId);
    setNodeLabel(editingConditionNode.data.label);
    setRule(editingConditionNode.data.rule);
  }, [editingConditionNode, open, selectedBlankNode]);

  const disableDeleteButton = (
    editingConditionNode &&
    (
      editingConditionNode.data.nextNodes.filter(id => id.indexOf('blank-') === -1).length > 0 ||
      editingConditionNode.data.falsyNodes.filter(id => id.indexOf('blank-') === -1).length > 0
    )
  );
  return (
    <RcDialog
      open={open}
      onClose={onClose}
    >
      <RcDialogTitle>Condition node</RcDialogTitle>
      <RcDialogContent>
        {
          (selectedBlankNode || editingConditionNode) ? null : (
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
          <Label color="neutral.f06" variant="body2">Node name</Label>
          <TextField
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            clearBtn={false}
            placeholder="Enter node name"
          />
        </InputLine>
        <RuleInput
          rule={rule}
          inputProperties={inputProperties}
          conditions={conditions}
          onUpdateRule={(newRule) => {
            setRule(newRule);
          }}
        />
      </RcDialogContent>
      <RcDialogActions>
        {
          editingConditionNode && (
            <RcButton
              variant="outlined"
              color="danger.b04"
              onClick={() => onDelete(editingConditionNode.id)}
              disabled={disableDeleteButton}
            >
              Delete
            </RcButton>
          )
        }
        <RcButton
          onClick={() => {
            onSave({
              parentNodeId,
              parentNodeBranch,
              label: nodeLabel,
              rule,
              description: getConditionDescription(rule, inputProperties, conditions),
            });
          }}
          disabled={
            (!parentNodeId && !selectedBlankNode) ||
            !nodeLabel ||
            !rule.input ||
            !rule.condition
          }
        >
          { editingConditionNode ? 'Save' : 'Add' }
        </RcButton>
      </RcDialogActions>
      <CloseButton
        symbol={Close}
        onClick={onClose}
      />
    </RcDialog>
  );
}
