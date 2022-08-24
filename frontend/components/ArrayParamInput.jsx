import React from 'react';
import { styled } from '@ringcentral/juno/foundation';
import {
  RcTypography,
  RcIconButton,
} from '@ringcentral/juno';
import { Add } from '@ringcentral/juno-icon';
import { BaseParamInput } from './BaseParamInput';

const ParamInputLine = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  align-items: baseline;
`;

const ParamHeader = styled(ParamInputLine)`
  align-items: center;
`;

const ParamLabel = styled(RcTypography)`
  min-width: 50px;
  margin-right: 10px;
`;

function checkInputType(inputType, paramType) {
  if (inputType === 'string') {
    return paramType === 'string' || paramType === 'text';
  }
  return inputType === paramType;
}

export function ArrayParamInput({
  value = [],
  setValue,
  param,
  remoteOptions,
  suggestions,
}) {
  return (
    <div>
      <ParamHeader>
        <ParamLabel color="neutral.f06" variant="body1">{param.name}</ParamLabel>
        <RcIconButton
          symbol={Add}
          size="small"
          onClick={() => {
            let newItem = param.itemType === 'string' ? '' : {};
            if (param.itemType === 'object') {
              param.itemProperties.forEach((item) => {
                newItem[item.id] = '';
              });
            }
            setValue([
              ...value,
              newItem,
            ]);
          }}
        />
      </ParamHeader>
      {value.map((item, itemIndex) => {
        if (param.itemType !== 'object') {
          return (
            <BaseParamInput
              key={itemIndex}
              param={param.itemProperty}
              value={item}
              setValue={(newValue) => {
                setValue([
                  ...value.slice(0, itemIndex),
                  newValue,
                  ...value.slice(itemIndex + 1),
                ]);
              }}
              remoteOptions={remoteOptions}
              suggestions={suggestions.filter((suggestion) => checkInputType(suggestion.type, param.itemType))}
              showDelete
              onDelete={() => {
                setValue([
                  ...value.slice(0, itemIndex),
                  ...value.slice(index + 1),
                ]);
              }}
            />
          )
        }
        return (
          <div key={itemIndex}>
            {
              param.itemProperties.map((itemProperty, propertyIndex) => {
                return (
                  <BaseParamInput
                    key={`${itemIndex}-${itemProperty.id}`}
                    param={itemProperty}
                    value={item[itemProperty.id]}
                    setValue={(newValue) => {
                      setValue([
                        ...value.slice(0, itemIndex),
                        {
                          ...item,
                          [itemProperty.id]: newValue,
                        },
                        ...value.slice(itemIndex + 1),
                      ]);
                    }}
                    remoteOptions={remoteOptions}
                    suggestions={suggestions.filter((suggestion) => checkInputType(suggestion.type, itemProperty.type))}
                    showDelete={propertyIndex === 0}
                    onDelete={() => {
                      setValue([
                        ...value.slice(0, itemIndex),
                        ...value.slice(itemIndex + 1),
                      ]);
                    }}
                  />
                );
              })
            }
          </div>
        )
      })}
    </div>
  );
}