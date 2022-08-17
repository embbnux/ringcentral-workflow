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
import { ActionDialog } from '../components/ActionDialog';

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
  const [selectBlankNodeId, setSelectBlankNodeId] = useState(null);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

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
  const editingActionNode = editingActionNodeId ?
    flowNodes.find(node => node.id === editingActionNodeId) :
    null;

  const selectBlankNode = selectBlankNodeId ?
    flowNodes.find(node => node.id === selectBlankNodeId) :
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
    setSelectBlankNodeId(null);
    if (node.type === 'trigger') {
      setEditingTriggerNodeId(node.id);
      setTriggerDialogOpen(true);
    } else if (node.type === 'condition') {
      setEditingConditionNodeId(node.id);
      setConditionDialogOpen(true);
    } else if (node.type === 'action') {
      setEditingActionNodeId(node.id);
      setActionDialogOpen(true);
    }
  }, []);

  const onAddNode = useCallback(({ blankNodeId, type }) => {
    setSelectBlankNodeId(blankNodeId);
    if (type === 'action') {
      setEditingActionNodeId(null);
      setActionDialogOpen(true);
    } else if (type === 'condition') {
      setEditingConditionNodeId(null);
      setConditionDialogOpen(true);
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
              setSelectBlankNodeId(null);
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
              setSelectBlankNodeId(null);
              setEditingConditionNodeId(null);
              setConditionDialogOpen(true);
              setAddButtonMenuOpen(false);
            }}
          >
            <RcListItemText primary="Add condition" />
          </RcMenuItem>
          <RcMenuItem
            disabled={flowNodes.length === 0}
            onClick={() => {
              setSelectBlankNodeId(null);
              setEditingActionNodeId(null);
              setActionDialogOpen(true);
              setAddButtonMenuOpen(false);
            }}
          >
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
            const blankNode = {
              id: `blank-${Date.now()}`,
              type: 'blank',
              data: {
                parentNodeId: 'trigger',
                parentNodeBranch: 'default',
                onAddNode,
              },
              position: { x: 325, y: 200 },
            };
            const newTriggerNode = {
              id: 'trigger',
              type: 'trigger',
              data: {
                label: trigger.name,
                nextNodes: [blankNode.id],
                type,
              },
              position: { x: 250, y: 25 },
            };
            setFlowNodes([newTriggerNode, blankNode]);
            setSelectBlankNodeId(null);
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
        selectBlankNode={selectBlankNode}
        editingConditionNode={editingConditionNode}
        allNodes={flowNodes}
        inputProperties={currentTrigger ? currentTrigger.outputData : []}
        onSave={({
          parentNodeId,
          parentNodeBranch,
          label,
          rule,
          enableFalsy,
          description,
        }) => {
          if (!editingConditionNode) {
            const parentNode = flowNodes.find(node => node.id === parentNodeId);
            const newConditionNodePosition = selectBlankNode ?
              selectBlankNode.position :
              { x: parentNode.position.x, y: parentNode.position.y + 120 };
            const newConditionNode = {
              id: `condition-${Date.now()}`,
              type: 'condition',
              data: {
                label,
                parentNodeId,
                parentNodeBranch,
                nextNodes: [],
                falsyNodes: [],
                rule,
                enableFalsy,
                description,
              },
              position: newConditionNodePosition,
            };
            const blankTrueNode = {
              id: `blank-true-${Date.now()}`,
              type: 'blank',
              data: {
                parentNodeId: newConditionNode.id,
                parentNodeBranch: 'default',
                onAddNode,
              },
              position: {
                x: enableFalsy ? newConditionNode.position.x - 120 : newConditionNode.position.x,
                y: newConditionNode.position.y + 150,
              },
            };
            newConditionNode.data.nextNodes.push(blankTrueNode.id);
            let blankFalseNode;
            if (enableFalsy) {
              blankFalseNode = {
                id: `blank-false-${Date.now()}`,
                type: 'blank',
                data: {
                  parentNodeId: newConditionNode.id,
                  parentNodeBranch: 'false',
                  onAddNode,
                },
                position: {
                  x: newConditionNode.position.x + 250,
                  y: newConditionNode.position.y + 150,
                },
              };
              newConditionNode.data.falsyNodes.push(blankFalseNode.id);
            }
            const parentNextNodesKey = parentNodeBranch === 'false' ? 'falsyNodes' : 'nextNodes';
            const blankNodeIdOfParentNode = parentNode.data[parentNextNodesKey].find((nodeId) => nodeId.indexOf('blank-') === 0);
            const oldNodes = getNewNodesWithUpdatedNode(
              flowNodes,
              parentNode.id,
              {
                [parentNextNodesKey]: [
                  ...parentNode.data[parentNextNodesKey].filter((nodeId) => nodeId !== blankNodeIdOfParentNode),
                  newConditionNode.id,
                ],
              },
            );
            const newNodeList = [
              ...oldNodes.filter(node => node.id !== blankNodeIdOfParentNode),
              newConditionNode,
              blankTrueNode,
            ];
            if (blankFalseNode) {
              newNodeList.push(blankFalseNode);
            }
            setFlowNodes(newNodeList);
            setConditionDialogOpen(false);
            setSelectBlankNodeId(null);
            return;
          }
          const newNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            editingConditionNodeId,
            {
              label,
              rule,
              description,
              enableFalsy,
            }
          );
          setFlowNodes(newNodes);
          setConditionDialogOpen(false);
        }}
        onDelete={(nodeId) => {
          const node = flowNodes.find(node => node.id === nodeId);
          const parentNode = flowNodes.find(flowNode => flowNode.id === node.data.parentNodeId);
          const blankNode = {
            id: `blank-${Date.now()}`,
            type: 'blank',
            data: {
              parentNodeId: node.data.parentNodeId,
              parentNodeBranch: node.data.parentNodeBranch,
              onAddNode,
            },
            position: node.position,
          };
          const parentNextNodesKey = node.data.parentNodeBranch === 'false' ? 'falsyNodes' : 'nextNodes';
          const oldNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            parentNode.id,
            {
              [parentNextNodesKey]: [
                ...parentNode.data[parentNextNodesKey].filter((id) => id !== nodeId),
                blankNode.id,
              ],
            }
          );
          setFlowNodes([
            ...oldNodes.filter((n) => {
              return (
                n.id !== nodeId &&
                node.data.nextNodes.indexOf(n.id) === -1 &&
                node.data.falsyNodes.indexOf(n.id) === -1
              );
            }),
            blankNode,
          ]);
          setConditionDialogOpen(false);
          setEditingActionNodeId(null);
        }}
      />
      <ActionDialog
        open={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false);
        }}
        actions={actions}
        selectBlankNode={selectBlankNode}
        editingActionNodeId={editingActionNodeId}
        allNodes={flowNodes}
        onSave={({
          parentNodeId,
          parentNodeBranch,
          type,
        }) => {
          const action = actions.find(action => action.id === type);
          if (!editingActionNode) {
            const parentNode = flowNodes.find(node => node.id === parentNodeId);
            const newActionNodePosition = selectBlankNode ?
              selectBlankNode.position :
              { x: parentNode.position.x, y: parentNode.position.y + 120 };
            const newActionNode = {
              id: `action-${Date.now()}`,
              type: 'action',
              data: {
                label: action.name,
                parentNodeId,
                parentNodeBranch,
                nextNodes: [],
                type,
              },
              position: newActionNodePosition,
            };
            const parentNextNodesKey = parentNodeBranch === 'false' ? 'falsyNodes' : 'nextNodes';
            const blankNodeIdOfParentNode = parentNode.data[parentNextNodesKey].find((nodeId) => nodeId.indexOf('blank-') === 0);
            const oldNodes = getNewNodesWithUpdatedNode(
              flowNodes,
              parentNode.id,
              {
                [parentNextNodesKey]: [
                  ...parentNode.data[parentNextNodesKey].filter((nodeId) => nodeId !== blankNodeIdOfParentNode),
                  newActionNode.id
                ],
              },
            );
            setFlowNodes([
              ...oldNodes.filter(node => node.id !== blankNodeIdOfParentNode),
              newActionNode,
            ]);
            setActionDialogOpen(false);
            setSelectBlankNodeId(null);
            return;
          }
          const newNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            editingActionNodeId,
            {
              label: action.name,
              type,
            }
          );
          setFlowNodes(newNodes);
          setActionDialogOpen(false);
        }}
        onDelete={(nodeId) => {
          const node = flowNodes.find(node => node.id === nodeId);
          const parentNode = flowNodes.find(flowNode => flowNode.id === node.data.parentNodeId);
          const blankNode = {
            id: `blank-${Date.now()}`,
            type: 'blank',
            data: {
              parentNodeId: node.data.parentNodeId,
              parentNodeBranch: node.data.parentNodeBranch,
              onAddNode,
            },
            position: node.position,
          };
          const parentNextNodesKey = node.data.parentNodeBranch === 'false' ?
            'falsyNodes' :
            'nextNodes';
          const oldNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            parentNode.id,
            {
              [parentNextNodesKey]: [
                ...parentNode.data[parentNextNodesKey].filter((id) => id !== nodeId),
                blankNode.id,
              ],
            }
          );
          setFlowNodes([
            ...oldNodes.filter(n => n.id !== nodeId),
            blankNode,
          ]);
          setActionDialogOpen(false);
          setEditingActionNodeId(null);
        }}
      />
    </Container>
  );
}
