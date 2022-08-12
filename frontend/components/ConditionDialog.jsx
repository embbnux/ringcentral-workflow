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
} from '@ringcentral/juno';
import { Add, Delete } from '@ringcentral/juno-icon';

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const TextField = styled(RcTextField)`
  min-width: 300px;
`;

const Label = styled(RcTypography)`
  margin-right: 20px;
  width: 100px;
`;

const Select = styled(RcSelect)`
  min-width: 300px;
`;

const RuleSelect = styled(RcSelect)`
  min-width: 150px;
  margin-right: 20px;
`;

const RuleValue = styled(RcTextField)`
  min-width: 150px;
  margin-top: 5px;
`;

function RuleInput({
  rule,
  onUpdateRule,
  inputProperties,
  conditions,
  onAddRule,
  onDeleteRule,
}) {
  const selectedProperty = inputProperties.find(p => p.id === rule.input);
  const propertyType = selectedProperty ? selectedProperty.type : '';
  const conditionOptions = conditions.filter((condition) => {
    return condition.supportTypes.indexOf(propertyType) > -1;
  });
  return (
    <InputLine>
      <RuleSelect
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
      </RuleSelect>
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
      <RuleValue
        value={rule.value}
        variant="outlined"
        onChange={(e) => onUpdateRule({ ...rule, value: e.target.value })}
      />
      <RcIconButton
        symbol={Delete}
        onClick={onDeleteRule}
      />
      <RcIconButton
        symbol={Add}
        onClick={onAddRule}
      />
    </InputLine>
  );
}

export function ConditionDialog({
  open,
  onClose,
  conditions,
  inputProperties,
  editingConditionNodeId,
  allNodes,
  onSave,
}) {
  const [parentNodeId, setParentNodeId] = useState('');
  const [nodeLabel, setNodeLabel] = useState('');
  const [matchType, setMatchType] = useState('');
  const [rules, setRules] = useState([]);

  useEffect(() => {
    if (!editingConditionNodeId || !open) {
      setParentNodeId('');
      setNodeLabel('');
      setMatchType('');
      const defaultProperty = inputProperties[0];
      let defaultCondition;
      if (defaultProperty) {
        defaultCondition = conditions.find((condition) => {
          return condition.supportTypes.indexOf(defaultProperty.type) > -1;
        });
      }
      const defaultRule = {
        id: 1,
        input: defaultProperty ? defaultProperty.id : '',
        condition: defaultCondition ? defaultCondition.id : '',
        value: '',
      };
      console.log(defaultRule);
      setRules([defaultRule]);
      return;
    }
    const editingConditionNode = allNodes.find(node => node.id === editingConditionNodeId);
    setParentNodeId(editingConditionNode.data.parentNodeId);
    setNodeLabel(editingConditionNode.data.label);
    setMatchType(editingConditionNode.data.matchType);
    setRules(editingConditionNode.data.rules);
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
          <TextField
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
              allNodes.filter((node) => node.type !== 'action').map(previousNode => (
                <RcMenuItem key={previousNode.id} value={previousNode.id}>
                  {previousNode.data.label}
                </RcMenuItem>
              ))
            }
          </Select>
        </InputLine>
        <InputLine>
          <Label color="neutral.f06" variant="body2">Match rule</Label>
          <Select
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            placeholder="Select condition match rule"
          >
            <RcMenuItem value="or">
              Match ANY of the following conditions
            </RcMenuItem>
            <RcMenuItem value="and">
              Match ALL of the following conditions
            </RcMenuItem>
          </Select>
        </InputLine>
        {
          rules.map((rule) => (
            <RuleInput
              key={rule.id}
              rule={rule}
              inputProperties={inputProperties}
              conditions={conditions}
              onUpdateRule={(newRule) => {
                console.log(newRule);
                const newRules = rules.map((rule) => {
                  if (rule.id === newRule.id) {
                    return newRule;
                  }
                  return rule;
                });
                console.log(newRules);
                setRules(newRules);
              }}
              onAddRule={() => {
                const newRule = {
                  id: rules.length + 1,
                  input: rule.input,
                  condition: rule.condition,
                  value: '',
                };
                setRules([...rules, newRule]);
              }}
              onDeleteRule={() => {
                setRules(rules.filter(r => r.id !== rule.id));
              }}
            />
          ))
        }
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
              rules,
              matchType,
            });
          }}
          disabled={!parentNodeId || !nodeLabel || !matchType}
        >
          { editingConditionNodeId ? 'Save' : 'Add' }
        </RcButton>
      </RcDialogActions>
    </RcDialog>
  );
}
