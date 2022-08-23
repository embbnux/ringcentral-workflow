import React, { useState, useEffect } from 'react';
import { RcDownshift } from '@ringcentral/juno';

const templateInputRegExp = /^{[^}]+}$/;

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
    const id = value.replace('{', '').replace('}', '');
    const item = suggestions.find(s => s.id === id);
    if (item) {
      setDownshiftValue([item]);
    } else {
      setInputValue(value);
    }
  }, [value]);

  return (
    <RcDownshift
      options={suggestions}
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
