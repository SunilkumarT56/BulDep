import { X, Settings2, PlayCircle, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ConfigPanel() {
  return (
    <div className="w-80 border-l border-border bg-card/30 flex flex-col h-full z-30">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Settings
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Mock Node Config Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Node Name</label>
            <input
              type="text"
              value="Generate Script"
              className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Model</label>
            <select className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm">
              <option>GPT-4o</option>
              <option>Claude 3.5 Sonnet</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-semibold mb-3">Parameters</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded border border-border">
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  Temperature
                </span>
                <span className="font-mono text-xs">0.7</span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded border border-border">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  Output Format
                </span>
                <span className="font-mono text-xs">JSON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background/20">
        <Button className="w-full gap-2" variant="outline">
          <PlayCircle className="w-4 h-4" />
          Test Node
        </Button>
      </div>
    </div>
  );
}
