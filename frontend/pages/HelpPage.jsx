import React from 'react';
import { styled } from '@ringcentral/juno/foundation';
import { RcTypography } from '@ringcentral/juno';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const TitleLine = styled(RcTypography)`
  margin-bottom: 20px;
`;

const SubTitle = styled(RcTypography)`
  padding: 10px 0;
`;

const Item = styled.li`
  margin-bottom: 10px;
`;

const Question = styled(RcTypography)`
  margin-bottom: 10px;
  margin-top: 10px;
`;

export function HelpPage() {
  return (
    <Container>
      <TitleLine variant="headline2">Help</TitleLine>
      <SubTitle variant="title2">
        # How to create workflow
      </SubTitle>
      <ol>
        <Item>
          <RcTypography variant="body1">
            Start with <b>New Flow</b> button to create workflow by flow editor
          </RcTypography>
        </Item>
        <Item>
          <RcTypography variant="body1">
            Add trigger node to the workflow
          </RcTypography>
        </Item>
        <Item>
          <RcTypography variant="body1">
            Add condition and action node to the workflow
          </RcTypography>
        </Item>
        <Item>
          <RcTypography variant="body1">
            Save workflow
          </RcTypography>
        </Item>
        <Item>
          <RcTypography variant="body1">
            Enable workflow at home page
          </RcTypography>
        </Item>
      </ol>
      <SubTitle variant="title2">
        # FAQ
      </SubTitle>
      <Question variant="body2">
        1. Why I can't edit the workflow?
      </Question>
      <RcTypography variant="body1">
        You can't edit workflow if it is enabled.
      </RcTypography>
      <Question variant="body2">
        2. Why I can't edit the node?
      </Question>
      <RcTypography variant="body1">
        You can't edit the node if the node is connected by sub nodes. You can delete sub nodes then edit the node.
      </RcTypography>
      <Question variant="body2">
        3. How to add template variables in text input?
      </Question>
      <RcTypography variant="body1">
        Enter "#" to select available variables.
      </RcTypography>
      <Question variant="body2">
        4. Phone number Format
      </Question>
      <RcTypography variant="body1">
        Currently, the workflow only supports to input E.164 format phone number.
      </RcTypography>
      <Question variant="body2">
        5. How to get RingCentral Team Messaging conversation Id
      </Question>
      <RcTypography variant="body1">
        You can use "Copy team URL" feature in RingCentral Team Messaging, then you can get conversation id in the URL.
      </RcTypography>
      <Question variant="body2">
        6. Why I can not enable the workflow
      </Question>
      <RcTypography variant="body1">
        You can't enable the workflow if there are blank nodes in the workflow. And least one action node should be added.
      </RcTypography>
      <Question variant="body2">
        7. Why my workflow is not working
      </Question>
      <RcTypography variant="body1">
        Workflow will stop working if the workflow is inactive more than 7 days.
      </RcTypography>
      <SubTitle variant="title2">
        # About RingCentral Labs
      </SubTitle>
      <RcTypography variant="body1">
        RingCentral Labs solutions are a set of free, customizable, curated solutions built by RingCentral developers. They are designed to provide finished end-user solutions that solve common problems. RingCentral Labs apps are free to use, but are not official products, and should be considered community projects - these apps are not officially tested or documented.
      </RcTypography>
    </Container>
  );
}
