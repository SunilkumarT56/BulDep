// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   BackgroundVariant,
//   Connection,
//   Edge,
//   Node,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
import { useCallback } from 'react';

// Initial Mock Data
// const initialNodes: Node[] = [
const initialNodes: any[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'YouTube Trigger' },
    type: 'input',
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', width: 180 },
  },
  {
    id: '2',
    position: { x: 400, y: 100 },
    data: { label: 'Generate Script' },
    type: 'input',
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', width: 180 },
  },
];

// const initialEdges: Edge[] = [
const initialEdges: any[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#64748b' } },
];

export function Canvas() {
  // const [nodes, , onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const onConnect = useCallback(
  //   (params: Connection) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges],
  // );

  return (
    <div className="flex-1 h-full bg-background relative flex items-center justify-center border-2 border-red-500">
      <h1 className="text-white text-2xl">Canvas Component Mounted Successfully</h1>
      {/* <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-background"
      >
        <Background color="#333" gap={20} size={1} variant={BackgroundVariant.Dots} />
        <Controls className="bg-card border border-border text-foreground fill-foreground" />
        <MiniMap
          className="bg-card border border-border"
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor="#64748b"
        />
      </ReactFlow> */}
    </div>
  );
}
