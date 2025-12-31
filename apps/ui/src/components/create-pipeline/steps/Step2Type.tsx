import { useEffect } from 'react';
import { usePipelineWizard } from '../PipelineWizardContext';

import { MonitorPlay, Smartphone, Clock, Play } from 'lucide-react';

export function Step2Type() {
  const { data, setData, setStepValid } = usePipelineWizard();

  useEffect(() => {
    // Step is always valid because we have defaults
    setStepValid(true);
  }, [setStepValid]);

  const handleTypeChange = (val: string) => {
    setData({ pipelineName: data.pipelineName, pipelineType: val as any });
  };

  const handleModeChange = (val: string) => {
    // If execution mode changes, scheduling step logic is handled in Context goNext/goBack
    // but the data for scheduling might need reset if we care.
    // Requirement: "If execution mode changes, scheduling step must reset"
    // We can just update the mode. The Context-level reset (or Step 6 reset) handles the rest.
    setData({ executionMode: val as any });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Pipeline Type */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-white">Pipeline Type</h3>
          <p className="text-sm text-zinc-400">Choose the format of content you want to produce.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('youtube_long')}
            className={`relative flex flex-col items-start p-4 rounded-xl border transition-all ${
              data.pipelineType === 'youtube_long'
                ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg mb-3 ${
                data.pipelineType === 'youtube_long'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-800/50 text-zinc-400'
              }`}
            >
              <MonitorPlay className="w-5 h-5" />
            </div>
            <div className="font-medium text-white">YouTube Long Form</div>
            <div className="text-xs text-zinc-500 mt-1 text-left">
              Traditional horizontal videos suitable for in-depth content.
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('youtube_shorts')}
            className={`relative flex flex-col items-start p-4 rounded-xl border transition-all ${
              data.pipelineType === 'youtube_shorts'
                ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg mb-3 ${
                data.pipelineType === 'youtube_shorts'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-800/50 text-zinc-400'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="font-medium text-white">YouTube Shorts</div>
            <div className="text-xs text-zinc-500 mt-1 text-left">
              Vertical short-form videos under 60 seconds.
            </div>
          </button>
        </div>
      </div>

      {/* Execution Mode */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-white">Execution Mode</h3>
          <p className="text-sm text-zinc-400">Decide how this pipeline is triggered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleModeChange('manual')}
            className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
              data.executionMode === 'manual'
                ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                data.executionMode === 'manual'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-800/50 text-zinc-400'
              }`}
            >
              <Play className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Manual</div>
              <div className="text-xs text-zinc-500 mt-0.5">Trigger runs individually by hand.</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('scheduled')}
            className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
              data.executionMode === 'scheduled'
                ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                data.executionMode === 'scheduled'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-800/50 text-zinc-400'
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Scheduled</div>
              <div className="text-xs text-zinc-500 mt-0.5">
                Run automatically on a recurring schedule.
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
