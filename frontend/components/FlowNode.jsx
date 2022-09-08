import React, { useRef, useState } from 'react';
import {
  RcTypography,
  RcIconButton,
  RcMenu,
  RcMenuItem,
  RcListItemText,
} from '@ringcentral/juno';
import {
  styled,
  palette2,
  useTheme,
  shadows,
} from '@ringcentral/juno/foundation';
import { Edit, AddBorder, Delete } from '@ringcentral/juno-icon';
import { Handle } from 'react-flow-renderer';

const IconButton = styled(RcIconButton)`
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -14px;
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

const BlankNodeWrapper = styled.div`
  border-radius: 50px;
  text-align: center;
  box-shadow: ${shadows('8')};
  background: ${palette2('neutral', 'b01')};
  border: 1px solid ${palette2('neutral', 'b03')};
  width: 60px;
  padding: 0;
`;

export const BlankNode = (({ isConnectable, data, id }) => {
  const theme = useTheme();
  const buttonRef = useRef(null);
  const [addButtonMenuOpen, setAddButtonMenuOpen] = useState(false);

  return (
    <>
      <BlankNodeWrapper>
        <RcIconButton
          title="Add new node"
          symbol={AddBorder}
          useRcTooltip
          size="small"
          innerRef={buttonRef}
          onClick={() => {
            setAddButtonMenuOpen(true);
          }}
        />
        <RcMenu
          anchorEl={buttonRef.current}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom'
          }}
          onClose={() => {
            setAddButtonMenuOpen(false);
          }}
          open={addButtonMenuOpen}
        >
          <RcMenuItem
            onClick={() => {
              setAddButtonMenuOpen(false);
              data.onAddNode && data.onAddNode({
                blankNodeId: id,
                type: 'condition',
              });
            }}
          >
            <RcListItemText primary="Add condition" />
          </RcMenuItem>
          <RcMenuItem
            onClick={() => {
              setAddButtonMenuOpen(false);
              data.onAddNode && data.onAddNode({
                blankNodeId: id,
                type: 'action',
              });
            }}
          >
            <RcListItemText primary="Add action" />
          </RcMenuItem>
          <RcMenuItem
            onClick={() => {
              setAddButtonMenuOpen(false);
              data.onAddNode && data.onAddNode({
                blankNodeId: id,
                type: 'exit',
              });
            }}
          >
            <RcListItemText primary="Add exit" />
          </RcMenuItem>
        </RcMenu>
      </BlankNodeWrapper>
      <Handle
        type="target"
        position="top"
        id="end"
        style={{ top: -5, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
    </>
  );
});

const ExitNodeWrapper = styled(BlankNodeWrapper)`
  min-width: 60px;
  min-height: 34px;
  background: ${palette2('label', 'blue01')};
  border: 1px solid ${palette2('label', 'blue01')};

  &:hover {
    .MuiTypography-root {
      display: none;
    }

    .RcIconButton-root {
      display: block;
    }
  }
`;

const ExitNodeText = styled(RcTypography)`
  height: 32px;
  line-height: 32px;
`;

const ExitDeleteButton = styled(IconButton)`
  right: 50%;
  margin-right: -16px;
`;

export const ExitNode = (({ isConnectable }) => {
  const theme = useTheme();
  const buttonRef = useRef(null);

  return (
    <>
      <ExitNodeWrapper>
        <ExitNodeText color="neutral.b01">Exit</ExitNodeText>
        <ExitDeleteButton
          symbol={Delete}
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
      </ExitNodeWrapper>
      <Handle
        type="target"
        position="top"
        id="end"
        style={{ top: -5, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
    </>
  );
});

const ConditionNodeWrapper = styled.div`
  min-width: 150px;
  max-width: 400px;
  border-radius: 5px;
  background: ${palette2('neutral', 'b01')};
  border: 1px solid ${palette2('neutral', 'b03')};
  text-align: center;
  padding: 10px 20px;
  box-shadow: ${shadows('8')};
  position: relative;

  &:hover {
    .RcIconButton-root {
      display: block;
    }
  }
`;

const ConditionText = styled(RcTypography)`
  height: 20px;
  line-height: 20px;
`;

export const ConditionNode = (({ data, isConnectable }) => {
  const theme = useTheme();
  const buttonRef = useRef(null);

  return (
    <>
      <ConditionNodeWrapper>
        <ConditionText color="neutral.f06">
          {data.label}
        </ConditionText>
        <ConditionText color="neutral.f04" variant="caption1">
          {data.description}
        </ConditionText>
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
        style={{ top: -4, background: theme.palette.neutral.f03 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position="bottom"
        id="true"
        style={{
          top: 62,
          background: theme.palette.neutral.f03
        }}
        isConnectable={isConnectable}
      />
      {
        <Handle
          type="source"
          position="right"
          id="false"
          style={{
            top: 32,
            left: 'auto',
            right: -4,
            background: '#555'
          }}
          isConnectable={isConnectable}
        />
      }
    </>
  );
});

const ActionNodeWrapper = styled(ConditionNodeWrapper)`
  border-radius: 50px;
  padding: 0 20px;
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
