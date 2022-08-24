import React, { useState } from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcTypography,
  RcTextField,
  RcIconButton,
} from '@ringcentral/juno';
import { Add, Delete } from '@ringcentral/juno-icon';
import { TextInputWithSuggestion } from './TextInputWithSuggestion';

const ParamInputLine = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  align-items: baseline;
`;

const ParamTextField = styled(RcTextField)`
  flex: 1;
`;

const KeyValueParamLabel = styled(RcTypography)`
  min-width: 50px;
  margin-right: 10px;
`;

const KeyValueHeader = styled(ParamInputLine)`
  align-items: center;
`;

const KeyValueParamTextField = styled(ParamTextField)`
  margin-right: 10px;
`;

const KeyValueParamLine = styled(ParamInputLine)`
  align-items: center;
`;

function KeyValuePairInput({
  propertyKey,
  propertyValue,
  onPropertyKeyChange,
  onPropertyValueChange,
  keyProperty,
  valueProperty,
  suggestions,
}) {
  const [keyInputValue, setKeyInputValue] = useState(propertyKey);

  return (
    <KeyValueParamLine>
      <KeyValueParamLabel color="neutral.f06" variant="body1">{keyProperty.name}</KeyValueParamLabel>
      <KeyValueParamTextField
        value={keyInputValue}
        clearBtn={false}
        onChange={(e) => {
          setKeyInputValue(e.target.value);
        }}
        onBlur={() => {
          onPropertyKeyChange({ target: { value: keyInputValue } });
        }}
      />
      <KeyValueParamLabel color="neutral.f06" variant="body1">{valueProperty.name}</KeyValueParamLabel>
      <TextInputWithSuggestion
        value={propertyValue}
        onChange={onPropertyValueChange}
        suggestions={suggestions}
      />
      <RcIconButton
        symbol={Delete}
        size="small"
        onClick={() => {
          onPropertyKeyChange({ target: { value: '' } });
        }}
      />
    </KeyValueParamLine>
  );
}

export function KeyValueParamInput({
  param,
  value = {},
  setValue,
  suggestions,
}) {
  return (
    <div>
      <KeyValueHeader>
        <KeyValueParamLabel color="neutral.f06" variant="body1">{param.name}</KeyValueParamLabel>
        <RcIconButton
          symbol={Add}
          size="small"
          onClick={() => {
            setValue({
              ...value,
              [`Key_${Object.keys(value).length + 1}_${Math.floor(Math.random() * 10)}`]: '',
            });
          }}
        />
      </KeyValueHeader>
      {
        Object.keys(value).map((key) => (
          <KeyValuePairInput
            key={key}
            propertyKey={key}
            propertyValue={value[key]}
            valueProperty={param.valueProperty}
            keyProperty={param.keyProperty}
            suggestions={suggestions}
            onPropertyValueChange={(e) => {
              setValue({
                ...value,
                [key]: e.target.value,
              });
            }}
            onPropertyKeyChange={(e) => {
              if (e.target.value === key) {
                return;
              }
              const newValue = {
                ...value,
              };
              if (e.target.value !== '') {
                newValue[e.target.value] = value[key];
              }
              delete newValue[key];
              setValue(newValue);
            }}
          />
        ))
      }
    </div>
  );
}
