import {
  Play,
  Pause,
  RotateCw,
  BarChart2,
  Youtube,
  Clock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { PipelineActionsMenu } from '@/components/PipelineActionsMenu';
import { useState } from 'react';

interface Pipeline {
  name: string;
  admin_name: string;
  color?: string;
  _id?: string;
}

interface PipelineCardProps {
  pipeline: Pipeline;
}

export function PipelineCard({ pipeline }: PipelineCardProps) {
  const [status, setStatus] = useState<'active' | 'paused' | 'error'>('active');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data generator based on pipeline name hash or similar for consistency
  const [randomStats] = useState(() => ({
    pendingJobs: Math.floor(Math.random() * 10),
    successRate: 90 + Math.floor(Math.random() * 10),
  }));

  const handleAction = (action: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (action === 'pause') setStatus('paused');
      if (action === 'start') setStatus('active');
    }, 1000);
  };

  return (
    <div className="group relative p-0 rounded-lg bg-[#191919] border border-[#2F2F2F] hover:bg-[#202020] transition-colors flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2F2F2F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-[#2F2F2F] flex items-center justify-center text-[#9B9A97]">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#FFFFFF] leading-tight">
              {pipeline.name}
            </h3>
            <p className="text-xs text-[#9B9A97] mt-0.5">{pipeline.admin_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
              status === 'active'
                ? 'bg-[#E3F2FD] text-[#2EAADC] border-transparent' // Notion Blue
                : status === 'paused'
                ? 'bg-[#FDECC8] text-[#D9730D] border-transparent' // Notion Orange
                : 'bg-[#FFECEC] text-[#D44C47] border-transparent' // Notion Red
            }`}
          >
            {status === 'active' ? 'Running' : status === 'paused' ? 'Paused' : 'Error'}
          </div>
          <PipelineActionsMenu />
        </div>
      </div>

      {/* Stats List (Notion Properties style) */}
      <div className="p-4 space-y-3 flex-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#9B9A97] w-1/3">
            <Clock className="w-4 h-4" /> <span>Last Run</span>
          </div>
          <div className="text-[#D4D4D4] flex-1 text-right">2h 15m ago</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#9B9A97] w-1/3">
            <RotateCw className="w-4 h-4" /> <span>Next Run</span>
          </div>
          <div className="text-[#D4D4D4] flex-1 text-right">Tomorrow, 10:00 AM</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#9B9A97] w-1/3">
            <Loader2 className="w-4 h-4" /> <span>Pending</span>
          </div>
          <div className="text-[#D4D4D4] flex-1 text-right">{randomStats.pendingJobs} Videos</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#9B9A97] w-1/3">
            <CheckCircle2 className="w-4 h-4" /> <span>Success</span>
          </div>
          <div className="text-[#D4D4D4] flex-1 text-right">{randomStats.successRate}%</div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-2 border-t border-[#2F2F2F] grid grid-cols-2 gap-px bg-[#2F2F2F]">
        <button
          onClick={() => handleAction(status === 'active' ? 'pause' : 'start')}
          className="flex items-center justify-center gap-2 py-2 bg-[#191919] hover:bg-[#202020] text-[#9B9A97] hover:text-[#FFFFFF] text-xs font-medium transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : status === 'active' ? (
            <>
              {' '}
              <Pause className="w-3.5 h-3.5" /> Pause{' '}
            </>
          ) : (
            <>
              {' '}
              <Play className="w-3.5 h-3.5" /> Resume{' '}
            </>
          )}
        </button>
        <button className="flex items-center justify-center gap-2 py-2 bg-[#191919] hover:bg-[#202020] text-[#9B9A97] hover:text-[#FFFFFF] text-xs font-medium transition-colors">
          <BarChart2 className="w-3.5 h-3.5" /> Analytics
        </button>
      </div>
    </div>
  );
}
