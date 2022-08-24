import React from 'react';
import { styled } from '@ringcentral/juno/foundation';
import { RcTypography } from '@ringcentral/juno';
import { KeyValueParamInput } from './KeyValueParamInput';
import { BaseParamInput } from './BaseParamInput'
import { ArrayParamInput } from './ArrayParamInput';

const Label = styled(RcTypography)`
  margin-right: 20px;
`;

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
  if (param.type === 'array') {
    return (
      <ArrayParamInput
        param={param}
        value={value}
        setValue={setValue}
        remoteOptions={remoteOptions}
        suggestions={suggestions}
      />
    );
  }
  return (
    <BaseParamInput
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
  if (paramType === 'keyValue' || paramType === 'array') {
    return true;
  }
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
              value={values[param.id]}
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
              }
            />
          );
        })
      }
    </ParamsInputWrapper>
  );
}
