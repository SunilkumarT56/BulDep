import { Button } from '@/components/ui/Button';
import { Play, Pause, Save, Rocket, Settings, Plus, FlaskConical } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-14 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 z-40 relative">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-foreground">YouTube Automation Pipeline</h2>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-2">
          <FlaskConical className="w-3.5 h-3.5" />
          Dry Run
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-2 border-border bg-transparent hover:bg-accent"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Play className="w-3.5 h-3.5" />
          Run
        </Button>
      </div>
    </div>
  );
}
