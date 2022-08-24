import React, { useState } from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcSelect,
  RcMenuItem,
  RcTypography,
  RcTextField,
  RcTextarea,
  RcIconButton,
} from '@ringcentral/juno';
import { Add, Delete } from '@ringcentral/juno-icon';
import { TextInputWithSuggestion } from './TextInputWithSuggestion';
import { TemplateTextEditor } from './TemplateTextEditor';

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

const ParamLabel = styled(RcTypography)`
  margin-right: 10px;
  min-width: 150px;
`;

const ParamInputLine = styled(InputLine)`
  margin: 10px 0;
  align-items: baseline;
`;

const ParamTextarea = styled(RcTextarea)`
  flex: 1;
`;

const ParamTextField = styled(RcTextField)`
  flex: 1;
`;

function ParmaOptionSelect({
  value,
  onChange,
  param,
  remoteOptions
}) {
  let options = param.options;
  if (param.remote) {
    options = remoteOptions[param.remoteOptionKey] || [];
  }
  return (
    <Select
      value={(param.remote && options.length === 0) ? '' : value}
      onChange={onChange}
    >
      {
        options.map(item => (
          <RcMenuItem key={item.value} value={item.value}>
            {item.name}
          </RcMenuItem>
        ))
      }
    </Select>
  );
};

function NormalTypeParamInput({
  param,
  value,
  setValue,
  remoteOptions,
  suggestions,
}) {
  return (
    <ParamInputLine>
      <ParamLabel color="neutral.f06" variant="body1">{param.name}</ParamLabel>
      {
        param.type === 'string' ? (
          <TextInputWithSuggestion
            value={value}
            setValue={setValue}
            suggestions={suggestions}
          />
        ) : null
      }
      {
        (param.type === 'text') ? (
          <TemplateTextEditor
            value={value}
            setValue={setValue}
          />
        ) : null
      }
      {
        (param.type === 'json') ? (
          <ParamTextarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            minRows={2}
          />
        ) : null
      }
      {
        param.type === 'option' ? (
          <ParmaOptionSelect
            param={param}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            remoteOptions={remoteOptions}
          /> 
        ) : null
      }
    </ParamInputLine>
  );
}

const KeyValueParamLabel = styled(ParamLabel)`
  min-width: 50px;
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
      <KeyValueParamTextField
        clearBtn={false}
        value={propertyValue}
        onChange={onPropertyValueChange}
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

function KeyValueParamInput({
  param,
  value = {},
  setValue,
}) {
  return (
    <>
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
    </>
  );
}

function ParamInput({
  param,
  value,
  setValue,
  remoteOptions,
  suggestions,
}) {
  if (param.type === 'keyValue') {
    return (
      <KeyValueParamInput
        param={param}
        value={value}
        setValue={setValue}
        remoteOptions={remoteOptions}
      />
    );
  }
  return (
    <NormalTypeParamInput
      param={param}
      value={value}
      setValue={setValue}
      remoteOptions={remoteOptions}
      suggestions={suggestions}
    />
  );
}

const ParamsInputWrapper = styled.div`
  margin-top: 20px;
`;

function checkInputType(inputType, paramType) {
  if (inputType === 'string') {
    return paramType === 'string' || paramType === 'text';
  }
  return inputType === paramType;
}

export function ActionParamsInput({
  action,
  values,
  setValues,
  remoteOptions,
  inputProperties,
}) {
  if (!action) {
    return null;
  }
  return (
    <ParamsInputWrapper>
      <Label color="neutral.f06" variant="body2">Action params</Label>
      {
        action.params.map((param) => {
          return (
            <ParamInput
              key={param.id}
              param={param}
              value={values[param.id] || ''}
              setValue={(newValue) => {
                setValues({
                  ...values,
                  [param.id]: newValue,
                });
              }}
              remoteOptions={remoteOptions}
              suggestions={
                inputProperties
                  .filter((item) => checkInputType(item.type, param.type))
                  .map((item) => ({
                    id: item.id,
                    label: item.name,
                  }))
              }
            />
          );
        })
      }
    </ParamsInputWrapper>
  );
}
