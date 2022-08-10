import React, { useRef } from 'react';
import {
  RcTypography,
  RcIconButton,
} from '@ringcentral/juno';
import {
  styled,
  palette2,
  useTheme,
  shadows,
} from '@ringcentral/juno/foundation';
import { Edit } from '@ringcentral/juno-icon';
import { Handle } from 'react-flow-renderer';

const IconButton = styled(RcIconButton)`
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -16px;
  display: none;
`;

const TriggerNodeWrapper = styled.div`
  min-width: 150px;
  max-width: 300px;
  border-radius: 50px;
  background: ${palette2('label', 'blue01')};
  border: 1px solid ${palette2('label', 'blue01')};
  text-align: center;
  padding: 0 30px;
  box-shadow: ${shadows('8')};
  position: relative;

  &:hover {
    .RcIconButton-root {
      display: block;
    }
  }
`;

const StyledText = styled(RcTypography)`
  height: 40px;
  line-height: 40px;
  flex: 1;
  text-align: center;
`;

export const TriggerNode = (({ data, isConnectable }) => {
  const theme = useTheme();
  const buttonRef = useRef(null);

  return (
    <>
      <TriggerNodeWrapper>
        <StyledText color="neutral.b01">
          {data.label}
        </StyledText>
        <IconButton
          symbol={Edit}
          color="neutral.b01"
          size="small"
          onClick={() => {
            if (!buttonRef.current) {
              return;
            }
            const doubleClickEvent = new MouseEvent('dblclick', {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            buttonRef.current.dispatchEvent(doubleClickEvent);
          }}
          innerRef={buttonRef}
        />
      </TriggerNodeWrapper>
      <Handle
        type="source"
        position="bottom"
        id="start"
        style={{ top: 40, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
    </>
  );
});

const ConditionNodeWrapper = styled.div`
  min-width: 150px;
  border-radius: 5px;
  background: ${palette2('neutral', 'b01')};
  border: 1px solid ${palette2('neutral', 'b03')};
  text-align: center;
  padding: 0 20px;
  box-shadow: ${shadows('8')};
  position: relative;

  &:hover {
    .RcIconButton-root {
      display: block;
    }
  }
`;

export const ConditionNode = (({ data, isConnectable }) => {
  const theme = useTheme();
  const buttonRef = useRef(null);

  return (
    <>
      <ConditionNodeWrapper>
        <StyledText color="neutral.f06">
          {data.label}
        </StyledText>
        <IconButton
          symbol={Edit}
          color="neutral.f06"
          size="small"
          onClick={() => {
            if (!buttonRef.current) {
              return;
            }
            const doubleClickEvent = new MouseEvent('dblclick', {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            buttonRef.current.dispatchEvent(doubleClickEvent);
          }}
          innerRef={buttonRef}
        />
      </ConditionNodeWrapper>
      <Handle
        type="target"
        position="top"
        id="input"
        style={{ top: -4, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position="bottom"
        id="result"
        style={{ top: 40, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
    </>
  );
});

const ActionNodeWrapper = styled(ConditionNodeWrapper)`
  border-radius: 50px;
`;

export const ActionNode = (({ data, isConnectable }) => {
  const theme = useTheme();
  const buttonRef = useRef(null);

  return (
    <>
      <ActionNodeWrapper>
        <StyledText color="neutral.f06">
          {data.label}
        </StyledText>
        <IconButton
          symbol={Edit}
          color="neutral.f06"
          size="small"
          onClick={() => {
            if (!buttonRef.current) {
              return;
            }
            const doubleClickEvent = new MouseEvent('dblclick', {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            buttonRef.current.dispatchEvent(doubleClickEvent);
          }}
          innerRef={buttonRef}
        />
      </ActionNodeWrapper>
      <Handle
        type="target"
        position="top"
        id="input"
        style={{ top: -4, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
    </>
  );
});
