import React, { memo } from 'react';
import { RcText } from '@ringcentral/juno';
import {
  styled,
  palette2,
  useTheme,
  shadows,
} from '@ringcentral/juno/foundation';

import { Handle } from 'react-flow-renderer';

const StartNodeWrapper = styled.div`
  min-width: 150px;
  border-radius: 50px;
  background: ${palette2('label', 'blue01')};
  border: 1px solid ${palette2('label', 'blue01')};
  text-align: center;
  padding: 0 20px;
  box-shadow: ${shadows('8')};
`;

const StyledText = styled(RcText)`
  height: 40px;
  line-height: 40px;
`;

export const StartNode = (({ data, isConnectable }) => {
  const theme = useTheme();

  return (
    <>
      <StartNodeWrapper>
        <StyledText color="neutral.b01">
          {data.label}
        </StyledText>
      </StartNodeWrapper>
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
`;

export const ConditionNode = (({ data, isConnectable }) => {
  const theme = useTheme();

  return (
    <>
      <ConditionNodeWrapper>
        <StyledText color="neutral.f06">
          {data.label}
        </StyledText>
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

  return (
    <>
      <ActionNodeWrapper>
        <StyledText color="neutral.f06">
          {data.label}
        </StyledText>
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
