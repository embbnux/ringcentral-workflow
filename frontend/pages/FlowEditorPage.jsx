import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { TriggerDialog } from '../components/TriggerDialog';

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
  const [triggerDialogOpen, setTriggerDialogOpen] = useState(false);
  const [triggers, setTriggers] = useState([]);
  const [editingTriggerNodeId, setEditingTriggerNodeId] = useState(null);
  const [editingConditionNodeId, setEditingConditionNodeId] = useState(null);
  const [editingActionNodeId, setEditingActionNodeId] = useState(null);

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

  useEffect(() => {
    if (!triggerDialogOpen) {
      return;
    }
    const fetchTriggers = async () => {
      try {
        const triggers = await client.getTriggers(flowId);
        setTriggers(triggers);
      } catch (e) {
        console.error(e);
        alertMessage({
          message: 'Failed to load triggers',
          type: 'error',
        });
      }
    };
    fetchTriggers();
  }, [triggerDialogOpen]);

  const editingTriggerNode = editingTriggerNodeId ?
    flowNodes.find(node => node.id === editingTriggerNodeId) :
    null;

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
          <RcMenuItem
            onClick={() => {
              setEditingTriggerNodeId(null);
              setTriggerDialogOpen(true);
            }}
            disabled={flowNodes.length > 0}
          >
            <RcListItemText primary="Add trigger" />
          </RcMenuItem>
          <RcMenuItem disabled={flowNodes.length === 0}>
            <RcListItemText primary="Add condition" />
          </RcMenuItem>
          <RcMenuItem disabled={flowNodes.length === 0}>
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
          onNodesChange={(nodeChanges) => {
            console.log(nodeChanges);
          }}
          onNodeDoubleClick={(e, node) => {
            if (node.type === 'trigger') {
              setEditingTriggerNodeId(node.id);
              setTriggerDialogOpen(true);
            } else if (node.type === 'condition') {
              setEditingConditionNodeId(node.id);
            } else if (node.type === 'action') {
              setEditingActionNodeId(node.id);
            }
          }}
        /> 
      </EditorContainer>
      <TriggerDialog
        open={triggerDialogOpen}
        onClose={() => {
          setTriggerDialogOpen(false);
        }}
        triggers={triggers}
        editingTriggerNode={editingTriggerNode}
        onSave={(type) => {
          const trigger = triggers.find(trigger => trigger.id === type);
          if (!editingTriggerNode) {
            const newTriggerNode = {
              id: String(Date.now()),
              type: 'trigger',
              data: {
                label: trigger.name,
                nextNodes: [],
                type,
              },
              position: { x: 250, y: 25 },
            };
            setFlowNodes([newTriggerNode]);
            setTriggerDialogOpen(false);
            return;
          }
          const newNodes = flowNodes.map((node) => {
            if (node.id !== editingTriggerNodeId) {
              return node;
            }
            return {
              ...node,
              data: {
                ...node.data,
                label: trigger.name,
                type,
              },
            };
          });
          setFlowNodes(newNodes);
          setTriggerDialogOpen(false);
        }}
      />
    </Container>
  );
}
