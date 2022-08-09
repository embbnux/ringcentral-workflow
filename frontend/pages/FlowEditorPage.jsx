import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import {
  RcAppBar,
  RcTypography,
  RcIconButton,
  RcButton,
  RcIcon,
  RcMenu,
  RcMenuItem,
  RcListItemText,
  RcTextField,
} from '@ringcentral/juno';
import { styled, palette2 } from '@ringcentral/juno/foundation';
import { ChevronLeft, Add, Edit } from '@ringcentral/juno-icon';
import { FlowEditor } from '../components/FlowEditor';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${palette2('neutral', 'b03')};
`;

const Title = styled(RcTypography)`
  line-height: 56px;
`;

const TitleField = styled.div`
  margin-right: 10px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = styled(RcAppBar)`
  background: ${palette2('nav', 'b01')};
  padding-left: 10px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditorContainer = styled.div`
  width: 100%;
  height: calc(100% - 56px);
`;

const Button = styled(RcButton)`
  margin-left: 20px;
`;

export function FlowEditorPage({
  navigate,
  client,
  alertMessage,
}) {
  const addButtonRef = useRef(null);
  const [addButtonMenuOpen, setAddButtonMenuOpen] = useState(false);
  const { id: flowId } = useParams();
  const [flowName, setFlowName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [flowNodes, setFlowNodes] = useState([]);
  useEffect(() => {
    if (!flowId) {
      return;
    }
    if (flowId === 'new') {
      setFlowName('Untitled Flow');
      return;
    }
    const fetchFlow = async () => {
      try {
        const flow = await client.getFlow(flowId);
        setFlowName(flow.name);
        setFlowNodes(flow.nodes);
      } catch (e) {
        console.error(e);
        alertMessage({
          message: 'Failed to load flow',
          type: 'error',
        });
      }
    };
    fetchFlow();
  }, [flowId])
  return (
    <Container>
      <Header color="transparent" variant='outlined'>
        <RcIconButton
          symbol={ChevronLeft}
          onClick={() => {
            navigate('/app/flows');
          }}
        />
        <TitleField>
          {
            isEditingName ? (
              <RcTextField
                value={flowName}
                onChange={(e) => {
                  setFlowName(e.target.value);
                }}
                onBlur={() => {
                  if (!flowName) {
                    setFlowName('Untitled Flow');
                  }
                  setIsEditingName(false);
                }}
                clearBtn={false}
              />
            ) : (
              <Title variant="subheading1" noWrap>
                {flowName}
              </Title>
            )
          }
          {
            !isEditingName && (
              <RcIconButton
                symbol={Edit}
                size="small"
                onClick={() => {
                  setIsEditingName(true);
                }}
              />
            )
          }
        </TitleField>
        <Button
          startIcon={<RcIcon symbol={Add} />}
          variant="outlined"
          innerRef={addButtonRef}
          onClick={() => {
            setAddButtonMenuOpen(true);
          }}
        >
          Add node
        </Button>
        <RcMenu
          anchorEl={addButtonRef.current}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom'
          }}
          onClose={() => {
            setAddButtonMenuOpen(false);
          }}
          open={addButtonMenuOpen}
        >
          <RcMenuItem>
            <RcListItemText primary="Add trigger" />
          </RcMenuItem>
          <RcMenuItem>
            <RcListItemText primary="Add condition" />
          </RcMenuItem>
          <RcMenuItem>
            <RcListItemText primary="Add action" />
          </RcMenuItem>
        </RcMenu>
        <Button>
          Save
        </Button>
      </Header>
      <EditorContainer>
        <FlowEditor
          nodes={flowNodes}
        />
      </EditorContainer>
    </Container>
  );
}
