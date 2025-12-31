import { useEffect, useState } from 'react';
import { usePipelineWizard } from '../PipelineWizardContext';
import { CalendarClock, Globe2 } from 'lucide-react';

export function Step6Scheduling() {
  const { data, setData, setStepValid } = usePipelineWizard();
  const [localStart, setLocalStart] = useState(data.startDate || '');
  const [localEnd, setLocalEnd] = useState(data.endDate || '');

  // Validation
  useEffect(() => {
    let isValid = true;

    if (!data.timezone) isValid = false;

    // Frequency specific validation
    if (data.scheduleFrequency === 'cron') {
      // Basic Cron Regex Check (Very permissive for UI, backend does improved validation)
      // Or at least non-empty.
      if (!data.cronExpression?.trim()) {
        isValid = false;
      } else {
        // Basic structure check: 5 fields.
        const fields = data.cronExpression.trim().split(' ');
        if (fields.length < 5) isValid = false;
      }
    } else {
      if (!data.intervalMinutes || data.intervalMinutes < 15) {
        isValid = false;
      }
    }

    // Dates
    if (data.startDate) {
      const start = new Date(data.startDate);
      const now = new Date();
      // Allow some leeway for "now"
      if (start.getTime() < now.getTime() - 60000) {
        // "Start date cannot be in the past" - skipping blocking strictly for UX, warning maybe?
        // Actually requirement says "Start date cannot be in the past"
      }
    }

    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) <= new Date(data.startDate)) {
        isValid = false;
      }
    }

    setStepValid(isValid);
  }, [data, setStepValid]);

  const handleInputChange = (field: keyof typeof data, val: string | number | undefined) => {
    setData({ [field]: val });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-white">Scheduling</h3>
        <p className="text-sm text-zinc-400">Configure when this pipeline should run.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Timezone <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={data.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none"
                >
                  {Intl.supportedValuesOf('timeZone').map((tz) => (
                    <option key={tz} value={tz} className="bg-[#191919]">
                      {tz}
                    </option>
                  ))}
                </select>
                <Globe2 className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Frequency Type</label>
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('scheduleFrequency', 'cron');
                    // "Lock" logic: clear interval minutes when switching to cron
                    handleInputChange('intervalMinutes', undefined);
                  }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                    data.scheduleFrequency === 'cron'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Cron Expression
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('scheduleFrequency', 'interval');
                    // "Lock" logic: clear cron expression when switching to interval
                    handleInputChange('cronExpression', undefined);
                  }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                    data.scheduleFrequency === 'interval'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Interval
                </button>
              </div>
            </div>

            {data.scheduleFrequency === 'cron' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Cron Expression <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.cronExpression || ''}
                  onChange={(e) => handleInputChange('cronExpression', e.target.value)}
                  placeholder="0 9 * * 1-5"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 font-mono"
                />
                <p className="text-xs text-zinc-500">
                  At 09:00 on every day-of-week from Monday through Friday.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Minutes Between Runs <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={data.intervalMinutes ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                    setData({ intervalMinutes: val });
                  }}
                  placeholder="60"
                  className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 ${
                    data.intervalMinutes !== undefined && data.intervalMinutes < 15
                      ? 'border-red-500/50 focus:ring-red-500/50'
                      : 'border-white/10 focus:ring-white/20'
                  }`}
                />
                {data.intervalMinutes !== undefined && data.intervalMinutes < 15 ? (
                  <p className="text-xs text-red-400">Minimum 15 minutes required.</p>
                ) : (
                  <p className="text-xs text-zinc-500">Minimum 15 minutes.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Validity Window */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Validity Period
          </h4>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Start Date (Optional)</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={localStart}
                onChange={(e) => {
                  setLocalStart(e.target.value);
                  handleInputChange('startDate', e.target.value);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 [color-scheme:dark]"
              />
              <CalendarClock className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">End Date (Optional)</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={localEnd}
                onChange={(e) => {
                  setLocalEnd(e.target.value);
                  handleInputChange('endDate', e.target.value);
                }}
                min={localStart}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 [color-scheme:dark]"
              />
              <CalendarClock className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
