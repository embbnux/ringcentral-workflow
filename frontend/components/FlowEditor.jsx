import React, { useCallback } from 'react';
import ReactFlow, { Controls } from 'react-flow-renderer';
import { TriggerNode, ConditionNode, ActionNode, BlankNode } from './FlowNode';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  blank: BlankNode,
};

function getEdgesFromNodes(nodes) {
  const edges = [];
  nodes.forEach((node) => {
    if (node.type == 'blank') {
      return;
    }
    if (node.type === 'condition' && node.data.enableFalsy) {
      if (node.data.nextNodes && node.data.nextNodes.length > 0) {
        node.data.nextNodes.forEach((nextNodeId) => {
          edges.push({
            id: `e${edges.length + 1}`,
            source: node.id,
            target: nextNodeId,
            sourceHandle: 'true',
            label: 'True',
            animated: true,
            type: 'step',
          });
        });
      }
      if (node.data.falsyNodes && node.data.falsyNodes.length > 0) {
        node.data.falsyNodes.forEach((nextNodeId) => {
          edges.push({
            id: `e${edges.length + 1}`,
            source: node.id,
            target: nextNodeId,
            animated: true,
            sourceHandle: 'false',
            label: 'False',
            type: 'step',
          });
        });
      }
      return;
    }
    node.data.nextNodes.forEach((nextNodeId) => {
      edges.push({
        id: `e${edges.length + 1}`,
        source: node.id,
        target: nextNodeId,
        animated: true,
        type: 'step',
      });
    });
  });
  return edges;
}

export function FlowEditor({
  nodes,
  onNodesChange,
  onEditNode,
  onDragNode,
}) {
  const edges = getEdgesFromNodes(nodes);
  
  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeDoubleClick={onEditNode}
      onNodeDrag={onDragNode}
    >
      <Controls />
    </ReactFlow>
  );
}
