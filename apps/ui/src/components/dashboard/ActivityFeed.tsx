interface ActivityItem {
  id: string;
  type: 'upload' | 'metadata' | 'thumbnail' | 'error' | 'retry';
  message: string;
  time: string;
  pipeline: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'upload',
    message: 'Video "Top 10 AI Tools" uploaded successfully',
    time: '2 mins ago',
    pipeline: 'Tech Trends',
  },
  {
    id: '2',
    type: 'metadata',
    message: 'Generated title and description for Job #124',
    time: '15 mins ago',
    pipeline: 'Daily Vlogs',
  },
  {
    id: '3',
    type: 'thumbnail',
    message: 'Thumbnail created using prompt v2',
    time: '1 hour ago',
    pipeline: 'Tech Trends',
  },
  {
    id: '4',
    type: 'error',
    message: 'Upload failed: Token expired',
    time: '3 hours ago',
    pipeline: 'Shorts Factory',
  },
  {
    id: '5',
    type: 'retry',
    message: 'Retrying failed upload job #892',
    time: '3 hours ago',
    pipeline: 'Shorts Factory',
  },
  {
    id: '6',
    type: 'upload',
    message: 'Video "Morning Routine" uploaded',
    time: '5 hours ago',
    pipeline: 'Daily Vlogs',
  },
];

export function ActivityFeed() {
  return (
    <div className="flex flex-col h-full max-h-[600px] sticky top-8">
      <div className="pb-4 mb-4 border-b border-[#2F2F2F]">
        <h3 className="font-semibold text-[#FFFFFF] text-sm">Activity</h3>
      </div>

      <div className="overflow-y-auto custom-scrollbar space-y-6 flex-1 pr-2">
        {MOCK_ACTIVITY.map((item) => (
          <div key={item.id} className="relative pl-6">
            <div className="absolute left-1.5 top-2 bottom-[-24px] w-px bg-[#2F2F2F]" />
            <div
              className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border border-[#2F2F2F] ${
                item.type === 'error' ? 'bg-red-500' : 'bg-[#2F2F2F]'
              }`}
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#D4D4D4] leading-relaxed">{item.message}</span>
              <div className="flex items-center gap-2 text-xs text-[#9B9A97]">
                <span>{item.time}</span>
                <span>•</span>
                <span className="opacity-75">{item.pipeline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
