import React from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcSelect,
  RcMenuItem,
  RcTypography,
  RcTextField,
  RcTextarea,
} from '@ringcentral/juno';

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
      value={value}
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

function ParamInput({
  param,
  value,
  onChange,
  remoteOptions,
}) {
  return (
    <ParamInputLine>
      <ParamLabel color="neutral.f06" variant="body1">{param.name}</ParamLabel>
      {
        param.type === 'string' ? (
          <ParamTextField
            value={value}
            onChange={onChange}
          />
        ) : null
      }
      {
        (param.type === 'text' || param.type === 'json') ? (
          <ParamTextarea
            value={value}
            onChange={onChange}
            minRows={2}
          />
        ) : null
      }
      {
        param.type === 'option' ? (
          <ParmaOptionSelect
            param={param}
            value={value}
            onChange={onChange}
            remoteOptions={remoteOptions}
          /> 
        ) : null
      }
    </ParamInputLine>
  );
}

const ParamsInputWrapper = styled.div`
  margin-top: 20px;
`;

export function ActionParamsInput({
  action,
  values,
  setValues,
  remoteOptions,
}) {
  if (!action) {
    return null;
  }
  return (
    <ParamsInputWrapper>
      <Label color="neutral.f06" variant="body2">Action params</Label>
      {
        action.params.map(param => (
          <ParamInput
            key={param.id}
            param={param}
            value={values[param.id] || ''}
            onChange={(e) => {
              setValues({
                ...values,
                [param.id]: e.target.value,
              });
            }}
            remoteOptions={remoteOptions}
          />
        ))
      }
    </ParamsInputWrapper>
  );
}
