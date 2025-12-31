import { Upload, CheckCircle2, FileJson, PlayCircle } from 'lucide-react';

export function QuickActionsSection() {
  return (
    <div className="mt-12">
      <h3 className="text-sm font-semibold text-[#9B9A97] mb-4 uppercase tracking-wider">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex items-center gap-3 p-3 rounded hover:bg-[#202020] transition-colors border border-transparent hover:border-[#2F2F2F] text-left">
          <div className="h-8 w-8 rounded flex items-center justify-center text-[#9B9A97] bg-[#2F2F2F]">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#D4D4D4]">Test Upload</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-3 rounded hover:bg-[#202020] transition-colors border border-transparent hover:border-[#2F2F2F] text-left">
          <div className="h-8 w-8 rounded flex items-center justify-center text-[#9B9A97] bg-[#2F2F2F]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#D4D4D4]">Verify</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-3 rounded hover:bg-[#202020] transition-colors border border-transparent hover:border-[#2F2F2F] text-left">
          <div className="h-8 w-8 rounded flex items-center justify-center text-[#9B9A97] bg-[#2F2F2F]">
            <FileJson className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#D4D4D4]">Config</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-3 rounded hover:bg-[#202020] transition-colors border border-transparent hover:border-[#2F2F2F] text-left">
          <div className="h-8 w-8 rounded flex items-center justify-center text-[#9B9A97] bg-[#2F2F2F]">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#D4D4D4]">Sample</div>
          </div>
        </button>
      </div>
    </div>
  );
}
