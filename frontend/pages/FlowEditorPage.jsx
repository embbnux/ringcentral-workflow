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
import { ConditionDialog } from '../components/ConditionDialog';

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

function getNewNodesWithUpdatedNode(oldNodes, updateNodeId, updateNodeData) {
  return oldNodes.map((node) => {
    if (node.id !== updateNodeId) {
      return node;
    }
    return {
      ...node,
      data: {
        ...node.data,
        ...updateNodeData,
      },
    };
  })
}

export function FlowEditorPage({
  navigate,
  client,
  alertMessage,
  setLoading,
  loading,
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
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (!flowId) {
      return;
    }
    const initFlow = async () => {
      try {
        setLoading(true);
        const newTriggers = await client.getTriggers();
        setTriggers(newTriggers);
        const newConditions = await client.getConditions();
        setConditions(newConditions);
        const newActions = await client.getActions();
        setActions(newActions);
        if (flowId === 'new') {
          setFlowName('Untitled Flow');
          setTriggerDialogOpen(true);
        } else {
          const flow = await client.getFlow(flowId);
          setFlowName(flow.name);
          setFlowNodes(flow.nodes);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
        alertMessage({
          message: 'Failed to init flow editor',
          type: 'error',
        });
      }
    };
    initFlow();
  }, [flowId]);

  const editingTriggerNode = editingTriggerNodeId ?
    flowNodes.find(node => node.id === editingTriggerNodeId) :
    null;
  const editingConditionNode = editingConditionNodeId ?
    flowNodes.find(node => node.id === editingConditionNodeId) :
    null;

  const onEditNode = useCallback((e, node) => {
    if (
      (
        node.type === 'trigger' ||
        node.type === 'action'
      ) &&
      node.data.nextNodes && node.data.nextNodes.length > 0
    ) {
      alertMessage({
        message: 'Cannot edit a node with following nodes.',
        type: 'warn',
      });
      return;
    }
    if (node.type === 'trigger') {
      setEditingTriggerNodeId(node.id);
      setTriggerDialogOpen(true);
    } else if (node.type === 'condition') {
      setEditingConditionNodeId(node.id);
      setConditionDialogOpen(true);
    } else if (node.type === 'action') {
      setEditingActionNodeId(node.id);
    }
  }, []);

  const onDragNode = useCallback((e, draggedNode) => {
    const newNodes = flowNodes.map((node) => {
      if (node.id !== draggedNode.id) {
        return node;
      }
      return draggedNode;
    });
    setFlowNodes(newNodes);
  }, [flowNodes]);

  const triggerNode = flowNodes.find(node => node.type === 'trigger');
  let currentTrigger;
  if (triggerNode) {
    currentTrigger = triggers.find(trigger => trigger.id === triggerNode.data.type);
  }
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
              setAddButtonMenuOpen(false);
            }}
            disabled={flowNodes.length > 0}
          >
            <RcListItemText primary="Add trigger" />
          </RcMenuItem>
          <RcMenuItem
            disabled={flowNodes.length === 0}
            onClick={() => {
              setEditingConditionNodeId(null);
              setConditionDialogOpen(true);
              setAddButtonMenuOpen(false);
            }}
          >
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
          onEditNode={onEditNode}
          onDragNode={onDragNode}
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
              id: 'trigger',
              type: 'trigger',
              data: {
                label: trigger.name,
                nextNodes: [],
                type,
              },
              position: { x: 250, y: 25 },
            };
            setFlowNodes([newTriggerNode, {
              id: 'end',
              type: 'end',
              data: {},
              position: { x: 330, y: 500 },
            }]);
            setTriggerDialogOpen(false);
            return;
          }
          const newNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            editingTriggerNodeId,
            {
              label: trigger.name,
              type,
            },
          );
          setFlowNodes(newNodes);
          setTriggerDialogOpen(false);
        }}
      />
      <ConditionDialog
        open={conditionDialogOpen}
        onClose={() => {
          setConditionDialogOpen(false);
        }}
        conditions={conditions}
        editingConditionNodeId={editingConditionNodeId}
        allNodes={flowNodes}
        inputProperties={currentTrigger ? currentTrigger.outputData : []}
        onSave={({
          parentNodeId,
          label,
          rules,
          matchType,
        }) => {
          if (!editingConditionNode) {
            const parentNode = flowNodes.find(node => node.id === parentNodeId);
            const newConditionNode = {
              id: String(Date.now()),
              type: 'condition',
              data: {
                label,
                parentNodeId,
                nextNodes: [],
                rules,
                matchType,
              },
              position: { x: parentNode.position.x, y: parentNode.position.y + 120 },
            };
            parentNode.data.nextNodes.push(newConditionNode.id);
            const oldNodes = getNewNodesWithUpdatedNode(
              flowNodes,
              parentNode.id,
              {
                nextNodes: [...parentNode.data.nextNodes, newConditionNode.id],
              },
            );
            setFlowNodes([...oldNodes, newConditionNode]);
            setConditionDialogOpen(false);
            return;
          }
          const newNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            editingConditionNodeId,
            {
              label,
              rules,
              matchType,
            }
          );
          setFlowNodes(newNodes);
          setConditionDialogOpen(false);
        }}
      />
    </Container>
  );
}
