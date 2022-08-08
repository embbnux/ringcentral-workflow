import React from 'react';
import ReactFlow, { MiniMap, Controls, useNodesState } from 'react-flow-renderer';
import { StartNode, ConditionNode, ActionNode } from './FlowNode';

const nodeTypes = {
  start: StartNode,
  condition: ConditionNode,
  action: ActionNode,
};

export function FlowEditor() {
  const initialNodes = [
    {
      id: '1',
      type: 'start',
      data: {
        label: 'New SMS',
        onEdit: () => {
          console.log('edit');
        },
      },
      position: { x: 250, y: 25 },
    },
    {
      id: '2',
      type: 'condition',
      data: { label: 'Condition 1' },
      position: { x: 150, y: 125 },
    },
    {
      id: '3',
      type: 'action',
      data: { label: 'Send Message' },
      position: { x: 150, y: 250 },
    },
    {
      id: '4',
      type: 'condition',
      data: { label: 'Condition 2' },
      position: { x: 350, y: 125 },
    },
  ];
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, type: 'step' },
    { id: 'e2-3', source: '2', target: '3', animated: true, type: 'step' },
    { id: 'e1-4', source: '1', target: '4', animated: true, type: 'step' },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={initialEdges}
      nodeTypes={nodeTypes}
    >
      <Controls />
    </ReactFlow>
  );
}
