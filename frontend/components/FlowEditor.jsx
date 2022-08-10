import React from 'react';
import ReactFlow, { MiniMap, Controls, useNodesState } from 'react-flow-renderer';
import { TriggerNode, ConditionNode, ActionNode } from './FlowNode';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

// const initialNodes = [
//   {
//     id: '1',
//     type: 'trigger',
//     data: {
//       label: 'New SMS',
//       onEdit: () => {
//         console.log('edit');
//       },
//     },
//     position: { x: 250, y: 25 },
//   },
//   {
//     id: '2',
//     type: 'condition',
//     data: { label: 'Condition 1' },
//     position: { x: 150, y: 125 },
//   },
//   {
//     id: '3',
//     type: 'action',
//     data: { label: 'Send Message' },
//     position: { x: 150, y: 250 },
//   },
//   {
//     id: '4',
//     type: 'condition',
//     data: { label: 'Condition 2' },
//     position: { x: 350, y: 125 },
//   },
// ];

// const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2', animated: true, type: 'step' },
//   { id: 'e2-3', source: '2', target: '3', animated: true, type: 'step' },
//   { id: 'e1-4', source: '1', target: '4', animated: true, type: 'step' },
// ];

function getEdgesFromNodes(nodes) {
  let edgeId = 0;
  const edges = [];
  nodes.forEach((node) => {
    if (node.data.nextNodes && node.data.nextNodes.length > 0) {
      node.data.nextNodes.forEach((nextNodeId) => {
        edges.push({
          id: `e${edgeId}`,
          source: node.id,
          target: nextNodeId,
          animated: true,
          type: 'step',
        });
        edgeId += 1;
      });
    }
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
