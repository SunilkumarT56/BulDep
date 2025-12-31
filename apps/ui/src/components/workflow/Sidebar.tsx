import { Search, Plus, Layers, Video, Bell, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-card/30 flex flex-col h-full z-30">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Pipelines
          </h3>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-8 pl-8 pr-2 bg-background/50 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {[
          { name: 'Majic Mafia', type: 'media', status: 'active' },
          { name: 'Tech Saithan', type: 'media', status: 'active' },
          { name: 'Daily News', type: 'automation', status: 'paused' },
          { name: 'Deployment', type: 'deployment', status: 'active' },
        ].map((pipeline, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 cursor-pointer group transition-colors"
          >
            <div
              className={`
              h-8 w-8 rounded flex items-center justify-center border border-border bg-background
              ${pipeline.status === 'active' ? 'text-green-500' : 'text-yellow-500'}
            `}
            >
              {pipeline.type === 'media' && <Video className="w-4 h-4" />}
              {pipeline.type === 'automation' && <Bell className="w-4 h-4" />}
              {pipeline.type === 'deployment' && <Layers className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{pipeline.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{pipeline.status}</p>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border bg-background/20 space-y-2">
        {/* Quick Create Action - User requested "profile accordian create pipeline" */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-xs border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
          onClick={() => window.dispatchEvent(new CustomEvent('open-pipeline-wizard'))} // Assuming we have an event listener or handle this via props later
        >
          <Plus className="w-3.5 h-3.5" />
          Create Pipeline
        </Button>

        <div className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 cursor-pointer">
          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-purple-500" />
          <div className="flex-1">
            <p className="text-xs font-medium">Zylo Workspace</p>
            <p className="text-[10px] text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
