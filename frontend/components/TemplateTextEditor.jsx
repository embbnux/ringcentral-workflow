import React, { useState, useMemo, useRef, useEffect } from 'react';
import { styled, palette2, setOpacity, shadows } from '@ringcentral/juno/foundation';
import ReactQuill, { Quill } from 'react-quill';
import QuillMention from 'quill-mention';

import 'react-quill/dist/quill.snow.css';
import 'quill-mention/dist/quill.mention.css';

Quill.register('modules/mentions', QuillMention)

const templateMatchRegExp = /{[^}]+}/;

const QuillEditorWrapper = styled.div`
  flex: 1;

  .ql-container {
    font-family: Lato, Helvetica, Arial, sans-serif;
    color: ${palette2('neutral', 'f06')};
    font-size: 0.88rem;

    &.ql-snow {
      border: none;
    }
  }

  .ql-editor {
    border: 1px solid ${palette2('neutral', 'f02')};
    border-radius: 6px;

    &:focus {
      border: 1px solid ${palette2('interactive', 'b02')};
    }

    .mention {
      background-color: ${palette2('interactive', 'b01')};
      padding: 2px;
    }
  }

  .ql-mention-list-container {
    font-family: Lato, Helvetica, Arial, sans-serif;
    color: ${palette2('neutral', 'f06')};
    box-shadow: ${shadows('8')};
    border-radius: 4px;
    outline: 0;
    border: none;
  
    .ql-mention-list {
      padding: 8px 0;
    }

    .ql-mention-list-item {
      outline: none;
      box-sizing: border-box;
      height: auto;
      min-height: 32px;
      min-width: 112px;
      padding-top: 4px;
      padding-bottom: 4px;
      font-size: 0.9375rem;
      font-weight: 400;
      font-family: Lato, Helvetica, Arial, sans-serif;
      line-height: 22px;
      color: ${palette2('neutral', 'f06')};

      &.selected {
        background-color: ${setOpacity(palette2('neutral', 'f04'), '12')};
      }
    }
  }
`;

function getTextFromDelta(delta) {
  return delta.ops.reduce((text, op) => {
    if (typeof op.insert === 'string') {
      return `${text}${op.insert}`;
    }
    if (typeof op.insert === 'object' && op.insert.mention) {
      return `${text}{${op.insert.mention.id}}`;
    }
    return text;
  }, '');
}

function getDeltaFromText(text, suggestions) {
  if (!text) {
    return { ops: [{ insert: '\n' }] };
  }
  if (!templateMatchRegExp.test(text)) {
    return { ops: [{ insert: text }] };
  }
  const delta = { ops: [] };
  let currentText = text;
  let matchResult = currentText.match(templateMatchRegExp);
  let mentionIndex = 0;
  while(matchResult) {
    const previousText = currentText.slice(0, currentText.match(templateMatchRegExp).index);
    delta.ops.push({ insert: previousText });
    const mentionText = matchResult[0];
    const mentionId = mentionText.slice(1, -1);
    const mentionItem = suggestions.find(suggestion => suggestion.id === mentionId);
    if (!mentionItem) {
      delta.ops.push({ insert: mentionText });
    } else {
      const mentionObject = {
        id: mentionId,
        value: mentionItem.name,
        denotationChar: '#',
        index: `${mentionIndex}`,
      };
      delta.ops.push({ insert: { mention: mentionObject }});
      mentionIndex += 1;
    }
    currentText = currentText.slice(matchResult.index + mentionText.length);
    matchResult = currentText.match(templateMatchRegExp);
  }
  if (!matchResult) {
    delta.ops.push({ insert: currentText });
  }
  return delta;
}

export function TemplateTextEditor({
  value = '',
  setValue,
  suggestions,
}) {
  const [deltaValue, setDeltaValue] = useState(getDeltaFromText(value, suggestions));
  const suggestionsRef = useRef(suggestions);

  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions])
  const modules = useMemo(() => ({
    toolbar: false,
    mention: {
      allowedChars: /^[a-zA-Z0-9_\s]*$/,
      mentionDenotationChars: ["#", "{"],
      source: function(searchTerm, renderList) {
        const options = suggestionsRef.current.map((item) => ({
          id: item.id,
          value: item.name,
        }));
        if (searchTerm.length === 0) {
          renderList(options, searchTerm);
        } else {
          const matches = options.filter((suggestion) => {
            return suggestion.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          });
          renderList(matches, searchTerm);
        }
      }
    }
  }), []);

  return (
    <QuillEditorWrapper>
      <ReactQuill
        theme="snow"
        value={deltaValue}
        onChange={(content, delta, source, editor) => {
          const newDelta = editor.getContents();
          setDeltaValue(newDelta);
          setValue(getTextFromDelta(newDelta));
        }}
        placeholder="Enter text, use # for adding template variables"
        modules={modules}
      />
    </QuillEditorWrapper>
  );
}
