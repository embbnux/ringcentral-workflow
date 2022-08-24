import React from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcSelect,
  RcMenuItem,
  RcTypography,
  RcTextarea,
  RcIconButton,
} from '@ringcentral/juno';
import { Delete } from '@ringcentral/juno-icon';
import { TextInputWithSuggestion } from './TextInputWithSuggestion';
import { TemplateTextEditor } from './TemplateTextEditor';

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
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

const JSONParamInput = styled(RcTextarea)`
  flex: 1;
`;

function OptionParamInput({
  value = '',
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

export function BaseParamInput({
  param,
  value,
  setValue,
  remoteOptions,
  suggestions,
  showDelete,
  onDelete,
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
            suggestions={suggestions}
          />
        ) : null
      }
      {
        (param.type === 'json') ? (
          <JSONParamInput
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            minRows={3}
          />
        ) : null
      }
      {
        param.type === 'option' ? (
          <OptionParamInput
            param={param}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            remoteOptions={remoteOptions}
          /> 
        ) : null
      }
      {
        showDelete && (
          <RcIconButton
            symbol={Delete}
            size="small"
            onClick={onDelete}
          />
        )
      }
    </ParamInputLine>
  );
}
