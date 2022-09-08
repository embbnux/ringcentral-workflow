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
  RcSwitch,
  RcTooltip,
} from '@ringcentral/juno';
import { styled, palette2 } from '@ringcentral/juno/foundation';
import { ChevronLeft, Add, Edit } from '@ringcentral/juno-icon';
import { FlowEditor } from '../components/FlowEditor';
import { TriggerDialog } from '../components/TriggerDialog';
import { ConditionDialog } from '../components/ConditionDialog';
import { ActionDialog } from '../components/ActionDialog';
import { validateActionParams } from '../lib/validateActionParams';

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

const MessageRow = styled.div`
  width: 100%;
  text-align: left;
`;

function MultipleAlertMessages({ messages }) {
  return (
    <>
      {messages.map((message, index) => (<MessageRow key={index}>{message}</MessageRow>))}
    </>
  );
}

const ToggleButton = styled(RcSwitch)`
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
  const [isSaved, setIsSaved] = useState(false);
  const [flowEnabled, setFlowEnabled] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [flowNodes, setFlowNodes] = useState([]);
  const flowNodesRef = useRef(flowNodes);
  const [triggerDialogOpen, setTriggerDialogOpen] = useState(false);
  const [triggers, setTriggers] = useState([]);
  const [editingTriggerNodeId, setEditingTriggerNodeId] = useState(null);
  const [editingConditionNodeId, setEditingConditionNodeId] = useState(null);
  const [editingActionNodeId, setEditingActionNodeId] = useState(null);
  const [selectedBlankNodeId, setSelectBlankNodeId] = useState(null);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  useEffect(() => {
    flowNodesRef.current = flowNodes;
    console.log(flowNodes);
  }, [flowNodes]);

  const onDragNode = useCallback((e, draggedNode) => {
    const oldFlowNodes = flowNodesRef.current;
    const newNodes = oldFlowNodes.map((node) => {
      if (node.id !== draggedNode.id) {
        return node;
      }
      return draggedNode;
    });
    setFlowNodes(newNodes);
    setIsSaved(false);
  }, []);

  const onAddExitNode = useCallback(({ blankNodeId }) => {
    const oldFlowNodes = flowNodesRef.current;
    const blankNode = oldFlowNodes.find((node) => node.id === blankNodeId);
    const parentNode = oldFlowNodes.find((node) => node.id === blankNode.data.parentNodeId);
    const newExitNode = {
      id: `exit-${Date.now()}`,
      type: 'exit',
      data: {
        parentNodeId: blankNode.data.parentNodeId,
        parentNodeBranch: blankNode.data.parentNodeBranch,
      },
      position: blankNode.position,
    };
    const parentNextNodesKey = blankNode.data.parentNodeBranch === 'false' ? 'falsyNodes' : 'nextNodes';
    const newNodes = getNewNodesWithUpdatedNode(
      oldFlowNodes,
      parentNode.id,
      {
        [parentNextNodesKey]: [
          ...parentNode.data[parentNextNodesKey].filter((id) => id !== blankNodeId),
          newExitNode.id,
        ],
      }
    );
    setFlowNodes(
      newNodes.filter((node) => node.id !== blankNodeId).concat(newExitNode)
    );
  }, []);

  const onDeleteNode = useCallback((nodeId) => {
    const oldFlowNodes = flowNodesRef.current;
    const currentNode = oldFlowNodes.find((node) => node.id === nodeId);
    const parentNode = oldFlowNodes.find((n) => n.id === currentNode.data.parentNodeId);
    const parentNextNodesKey = currentNode.data.parentNodeBranch === 'false' ? 'falsyNodes' : 'nextNodes';
    let newBlankNode;
    const oldParentNodeNextNodes = parentNode.data[parentNextNodesKey];
    if (oldParentNodeNextNodes.length === 1) {
      newBlankNode = {
        id: `blank-${Date.now()}`,
        type: 'blank',
        data: {
          parentNodeId: parentNode.id,
          parentNodeBranch: currentNode.data.parentNodeBranch,
          onAddNode,
        },
        position: currentNode.position,
      };
    }
    const newParentNodeNextNodes = oldParentNodeNextNodes.filter((id) => id !== nodeId);
    if (newBlankNode) {
      newParentNodeNextNodes.push(newBlankNode.id);
    }
    let newNodes = getNewNodesWithUpdatedNode(
      oldFlowNodes,
      parentNode.id,
      {
        [parentNextNodesKey]: newParentNodeNextNodes,
      }
    );
    newNodes = newNodes.filter((n) => {
      if (n.id === currentNode.id) {
        return false;
      }
      if (currentNode.type === 'condition') {
        return (
          currentNode.data.nextNodes.indexOf(n.id) === -1 &&
          currentNode.data.falsyNodes.indexOf(n.id) === -1
        )
      }
      return true;
    });
    if (newBlankNode) {
      newNodes.push(newBlankNode);
    }
    setFlowNodes(newNodes);
  }, []);

  const onAddNode = useCallback(({ blankNodeId, type }) => {
    setSelectBlankNodeId(blankNodeId);
    if (type === 'action') {
      setEditingActionNodeId(null);
      setActionDialogOpen(true);
    } else if (type === 'condition') {
      setEditingConditionNodeId(null);
      setConditionDialogOpen(true);
    } else if (type === 'exit') {
      onAddExitNode({ blankNodeId });
    }
  }, []);

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
          setFlowEnabled(false);
          setIsSaved(false);
        } else {
          const flow = await client.getFlow(flowId);
          setFlowName(flow.name);
          setFlowEnabled(flow.enabled);
          setFlowNodes(flow.nodes.map((node) => {
            if (node.type === 'blank') {
              return {
                ...node,
                data: {
                  ...node.data,
                  onAddNode,
                },
              };
            }
            return node;
          }));
          setIsSaved(true);
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

  const selectedBlankNode = selectedBlankNodeId ?
    flowNodes.find(node => node.id === selectedBlankNodeId) :
    null;

  const onEditNode = useCallback((e, node) => {
    if (
      node.type === 'trigger' &&
      node.data.nextNodes &&
      node.data.nextNodes.filter(
        id => id.indexOf('blank-') === -1 && id.indexOf('exit-') === -1
      ).length > 0
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
    } else if (node.type === 'exit') {
      onDeleteNode(node.id);
    }
  }, []);

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
                  setIsSaved(false);
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
                disabled={flowEnabled}
              />
            )
          }
          {
            ((flowId !== 'new' && isSaved) || flowEnabled) && (
              <ToggleButton
                title={flowEnabled ? 'Disable the flow' : 'Enable the flow'}
                checked={flowEnabled}
                onChange={async (e, enabled) => {
                  setLoading(true);
                  try {
                    const newFlow = await client.toggleFlow(flowId, enabled);
                    setFlowEnabled(newFlow.enabled);
                    setLoading(false);
                  } catch (e) {
                    console.error(e);
                    setLoading(false);
                    if (e.response) {
                      const errorData = await e.response.json();
                      alertMessage({ type: 'error', message: errorData.message });
                      return;
                    }
                    alertMessage({ type: 'error', message: 'Failed to toggle flow' });
                  }
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
          disabled={flowEnabled}
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
          <RcMenuItem
            disabled={flowNodes.length < 2}
            onClick={() => {
              setSelectBlankNodeId(null);
              setEditingActionNodeId(null);
              setActionDialogOpen(true);
              setAddButtonMenuOpen(false);
            }}
          >
            <RcListItemText primary="Add exit" />
          </RcMenuItem>
        </RcMenu>
        <Button
          disabled={flowEnabled || isSaved}
          onClick={async () => {
            try {
              setLoading(true);
              const nodes = flowNodes.map(node => {
                if (node.type === 'blank') {
                  return {
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: {
                      parentNodeId: node.data.parentNodeId,
                      parentNodeBranch: node.data.parentNodeBranch,
                    },
                  };
                }
                return node;
              });
              if (flowId === 'new') {
                const flow = await client.createFlow(flowName, nodes);
                setLoading(false);
                alertMessage({ message: 'Flow saved successfully', type: 'success' });
                setIsSaved(true);
                navigate(`/app/flows/${flow.id}`);
                return;
              }
              await client.updateFlow(flowId, flowName, nodes);
              setLoading(false);
              setIsSaved(true);
              alertMessage({ message: 'Flow saved successfully', type: 'success' });
            } catch (e) {
              console.error(e);
              setLoading(false);
              if (e.response) {
                const errorData = await e.response.json();
                if (errorData.errors) {
                  const messages = errorData.errors.map((error) => {
                    if (error.nodeName) {
                      return `${error.nodeName}: ${error.message}`;
                    }
                    return error.message;
                  });
                  alertMessage({
                    message: (<MultipleAlertMessages messages={messages} />),
                    type: 'error',
                  });
                  return;
                } else {
                  alertMessage({
                    message: errorData.message,
                    type: 'error',
                  });
                  return;
                }
              }
              alertMessage({ message: 'Failed to save flow', type: 'error' });
            }
          }}
        >
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
            setIsSaved(false);
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
          setIsSaved(false);
        }}
      />
      <ConditionDialog
        open={conditionDialogOpen}
        onClose={() => {
          setConditionDialogOpen(false);
        }}
        conditions={conditions}
        selectedBlankNode={selectedBlankNode}
        editingConditionNode={editingConditionNode}
        allNodes={flowNodes}
        inputProperties={currentTrigger ? currentTrigger.outputData : []}
        onSave={({
          parentNodeId,
          parentNodeBranch,
          label,
          rule,
          description,
        }) => {
          if (!editingConditionNode) {
            const parentNode = flowNodes.find(node => node.id === parentNodeId);
            const newConditionNodePosition = selectedBlankNode ?
              selectedBlankNode.position :
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
                x: newConditionNode.position.x - 120,
                y: newConditionNode.position.y + 150,
              },
            };
            newConditionNode.data.nextNodes.push(blankTrueNode.id);
            const blankFalseNode = {
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
            setIsSaved(false);
            return;
          }
          const newNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            editingConditionNodeId,
            {
              label,
              rule,
              description,
            }
          );
          setFlowNodes(newNodes);
          setConditionDialogOpen(false);
          setIsSaved(false);
        }}
        onDelete={(nodeId) => {
          onDeleteNode(nodeId);
          setConditionDialogOpen(false);
          setEditingActionNodeId(null);
          setIsSaved(false);
        }}
      />
      <ActionDialog
        open={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false);
        }}
        loading={loading}
        actions={actions}
        selectedBlankNode={selectedBlankNode}
        editingActionNodeId={editingActionNodeId}
        allNodes={flowNodes}
        inputProperties={currentTrigger ? currentTrigger.outputData : []}
        onSave={({
          parentNodeId,
          parentNodeBranch,
          type,
          paramValues,
        }) => {
          const action = actions.find(action => action.id === type);
          const triggerSampleData = {};
          currentTrigger.outputData.forEach((item) => {
            triggerSampleData[item.id] = item.testData;
          });
          const validationErrors = validateActionParams({
            action,
            paramValues,
            sampleInputs: triggerSampleData,
          })
          if (validationErrors.length > 0) {
            alertMessage({
              type: 'error',
              message: (<MultipleAlertMessages messages={validationErrors.map(e => e.message)} />),
            })
            return;
          }
          if (!editingActionNode) {
            const parentNode = flowNodes.find(node => node.id === parentNodeId);
            const newActionNodePosition = selectedBlankNode ?
              selectedBlankNode.position :
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
                paramValues,
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
            setIsSaved(false);
            return;
          }
          const newNodes = getNewNodesWithUpdatedNode(
            flowNodes,
            editingActionNodeId,
            {
              label: action.name,
              type,
              paramValues,
            }
          );
          setFlowNodes(newNodes);
          setActionDialogOpen(false);
          setIsSaved(false);
        }}
        onDelete={(nodeId) => {
          onDeleteNode(nodeId);
          setActionDialogOpen(false);
          setEditingActionNodeId(null);
          setIsSaved(false);
        }}
        onLoadParamsOptions={async (type) => {
          try {
            setLoading(true);
            const options = await client.getActionParamsOptions(type);
            setLoading(false);
            return options;
          } catch (e) {
            console.error(e);
            setLoading(false);
            alertMessage({
              message: 'Failed to load param options',
              type: 'error',
            });
            return {};
          }
        }}
      />
    </Container>
  );
}
