import React, { useState, useEffect } from 'react';
import { styled, palette2 } from '@ringcentral/juno/foundation';
import { RcDownshift } from '@ringcentral/juno';

const templateInputRegExp = /^{[^}]+}$/;

const StyledDownshift = styled(RcDownshift)`
  .MuiChip-root {
    background-color: ${palette2('interactive', 'b01')};
  }
`;

export function TextInputWithSuggestion({
  value = '',
  setValue,
  suggestions,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState('');
  const [downshiftValue, setDownshiftValue] = useState([]);

  useEffect(() => {
    if (!templateInputRegExp.test(value)) {
      setInputValue(value);
      return;
    }
    const options = suggestions.map((item) => ({
      id: item.id,
      label: item.name,
    }));
    const id = value.replace('{', '').replace('}', '');
    const item = options.find(s => s.id === id);
    if (item) {
      setDownshiftValue([item]);
    } else {
      setInputValue(value);
    }
  }, [value, suggestions]);

  return (
    <StyledDownshift
      options={suggestions.map((item) => ({
        id: item.id,
        label: item.name,
      }))}
      value={downshiftValue}
      onChange={(newItems) => {
        setDownshiftValue(newItems);
        if (newItems.length > 0) {
          setValue(`{${newItems[0].id}}`);
        } else {
          setValue('');
        }
      }}
      placeholder={placeholder}
      multiple={false}
      inputValue={inputValue}
      onInputChange={(newValue) => {
        setInputValue(newValue);
        if (newValue !== '') {
          setValue(newValue);
        }
      }}
      onBlur={() => {
        if (downshiftValue.length > 0) {
          setValue(`{${downshiftValue[0].id}}`);
        } else {
          setValue(inputValue);
        }
      }}
    />
  );
}
