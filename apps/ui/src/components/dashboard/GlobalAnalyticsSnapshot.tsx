import { Activity, BarChart2, CheckCircle, Clock } from 'lucide-react';

export function GlobalAnalyticsSnapshot() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2F2F2F] rounded-lg overflow-hidden border border-[#2F2F2F]">
      {/* Active Pipelines */}
      <div className="bg-[#191919] p-4 flex flex-col gap-2 hover:bg-[#202020] transition-colors">
        <p className="text-[#9B9A97] text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4" /> Active Pipelines
        </p>
        <p className="text-3xl font-bold text-[#FFFFFF]">
          3 <span className="text-[#5A5A5A] text-xl font-normal">/ 5</span>
        </p>
      </div>

      {/* Videos Published */}
      <div className="bg-[#191919] p-4 flex flex-col gap-2 hover:bg-[#202020] transition-colors">
        <p className="text-[#9B9A97] text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Published
        </p>
        <p className="text-3xl font-bold text-[#FFFFFF]">12</p>
      </div>

      {/* Avg Publish Time */}
      <div className="bg-[#191919] p-4 flex flex-col gap-2 hover:bg-[#202020] transition-colors">
        <p className="text-[#9B9A97] text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" /> Avg Time
        </p>
        <p className="text-3xl font-bold text-[#FFFFFF]">4m 30s</p>
      </div>

      {/* Success Rate */}
      <div className="bg-[#191919] p-4 flex flex-col gap-2 hover:bg-[#202020] transition-colors">
        <p className="text-[#9B9A97] text-sm font-medium flex items-center gap-2">
          <BarChart2 className="w-4 h-4" /> Success Rate
        </p>
        <p className="text-3xl font-bold text-[#FFFFFF]">98.5%</p>
      </div>
    </div>
  );
}
