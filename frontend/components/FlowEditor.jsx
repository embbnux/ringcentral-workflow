import React from 'react';
import ReactFlow, { Controls } from 'react-flow-renderer';
import { TriggerNode, ConditionNode, ActionNode, EndNode } from './FlowNode';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode,
};

function getEdgesFromNodes(nodes) {
  const edges = [];
  nodes.forEach((node) => {
    if (node.type == 'end') {
      return;
    }
    if (!node.data.nextNodes || node.data.nextNodes.length === 0) {
      edges.push({
        id: `e${edges.length + 1}`,
        source: node.id,
        target: 'end',
        animated: true,
        type: 'step',
      });
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
