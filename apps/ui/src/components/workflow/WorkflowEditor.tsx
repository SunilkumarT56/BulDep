import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Canvas } from './Canvas';
import { ConfigPanel } from './ConfigPanel';

export function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative">
          <TopBar />

          <div className="flex-1 flex overflow-hidden relative">
            <Canvas />
            {/* Right Config Panel - currently static, can be conditionally rendered */}
            <ConfigPanel />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
