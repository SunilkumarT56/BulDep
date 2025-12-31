import { useEffect } from 'react';
import { usePipelineWizard } from '../PipelineWizardContext';
import { ImageIcon, LayoutTemplate, Wand2, Info } from 'lucide-react';

const VariableTag = ({
  label,
  field,
  onInsert,
}: {
  label: string;
  field: 'titleTemplate' | 'descriptionTemplate';
  onInsert: (field: 'titleTemplate' | 'descriptionTemplate', val: string) => void;
}) => (
  <button
    type="button"
    onClick={() => onInsert(field, label)}
    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded px-2 py-1 text-zinc-400 hover:text-white transition-colors"
  >
    {label}
  </button>
);

export function Step5Metadata() {
  const { data, setData, setStepValid } = usePipelineWizard();

  // Validation
  useEffect(() => {
    let isValid = true;
    if (!data.titleTemplate.trim()) isValid = false;
    if (!data.descriptionTemplate.trim()) isValid = false;
    // Tags optional
    // Language/Region have defaults
    // Thumbnail mode has default
    setStepValid(isValid);
  }, [data, setStepValid]);

  const handleInputChange = (field: keyof typeof data, val: string) => {
    setData({ [field]: val });
  };

  const insertVariable = (field: 'titleTemplate' | 'descriptionTemplate', variable: string) => {
    const current = data[field];
    setData({ [field]: current + ` {{${variable}}}` });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-white">Metadata Strategy</h3>
        <p className="text-sm text-zinc-400">
          Configure how your video titles and descriptions are generated.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Metadata Templates */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">
                Title Template <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-1">
                <VariableTag label="filename" field="titleTemplate" onInsert={insertVariable} />
                <VariableTag label="date" field="titleTemplate" onInsert={insertVariable} />
              </div>
            </div>
            <input
              type="text"
              value={data.titleTemplate}
              onChange={(e) => handleInputChange('titleTemplate', e.target.value)}
              placeholder="Global Tech News - {{date}}"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">
                Description Template <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-1">
                <VariableTag label="links" field="descriptionTemplate" onInsert={insertVariable} />
              </div>
            </div>
            <textarea
              value={data.descriptionTemplate}
              onChange={(e) => handleInputChange('descriptionTemplate', e.target.value)}
              placeholder="Check out the latest updates..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Tags Template (Optional)</label>
            <input
              type="text"
              value={data.tagsTemplate}
              onChange={(e) => handleInputChange('tagsTemplate', e.target.value)}
              placeholder="#news, #tech, #daily"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <p className="text-xs text-zinc-500">Comma separated tags.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Language</label>
              <select
                value={data.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
              >
                <option value="en" className="bg-[#191919]">
                  English
                </option>
                <option value="es" className="bg-[#191919]">
                  Spanish
                </option>
                <option value="fr" className="bg-[#191919]">
                  French
                </option>
                <option value="de" className="bg-[#191919]">
                  German
                </option>
                <option value="jp" className="bg-[#191919]">
                  Japanese
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Region</label>
              <select
                value={data.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
              >
                <option value="US" className="bg-[#191919]">
                  United States
                </option>
                <option value="UK" className="bg-[#191919]">
                  United Kingdom
                </option>
                <option value="IN" className="bg-[#191919]">
                  India
                </option>
                <option value="CA" className="bg-[#191919]">
                  Canada
                </option>
                <option value="AU" className="bg-[#191919]">
                  Australia
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Thumbnail Strategy */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-white">Thumbnail Strategy</h4>

          <div className="space-y-3">
            <button
              onClick={() => setData({ thumbnailMode: 'auto' })}
              className={`flex flex-col items-start p-4 rounded-xl border transition-all w-full text-left ${
                data.thumbnailMode === 'auto'
                  ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Wand2
                  className={`w-5 h-5 ${
                    data.thumbnailMode === 'auto' ? 'text-white' : 'text-zinc-400'
                  }`}
                />
                <span className="font-medium text-white">Auto-Generated</span>
              </div>
              <p className="text-xs text-zinc-400">
                AI will pick the best frame and add text overlay automatically.
              </p>
            </button>

            <button
              onClick={() => setData({ thumbnailMode: 'upload' })}
              className={`flex flex-col items-start p-4 rounded-xl border transition-all w-full text-left ${
                data.thumbnailMode === 'upload'
                  ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon
                  className={`w-5 h-5 ${
                    data.thumbnailMode === 'upload' ? 'text-white' : 'text-zinc-400'
                  }`}
                />
                <span className="font-medium text-white">Source Upload</span>
              </div>
              <p className="text-xs text-zinc-400">
                Expect a thumbnail file (jpg/png) alongside the video in source.
              </p>
            </button>

            <button
              onClick={() => setData({ thumbnailMode: 'template' })}
              className={`flex flex-col items-start p-4 rounded-xl border transition-all w-full text-left ${
                data.thumbnailMode === 'template'
                  ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <LayoutTemplate
                  className={`w-5 h-5 ${
                    data.thumbnailMode === 'template' ? 'text-white' : 'text-zinc-400'
                  }`}
                />
                <span className="font-medium text-white">Use Template</span>
              </div>
              <p className="text-xs text-zinc-400">
                Apply a consistent Figma-style template to every video.
              </p>
            </button>
          </div>

          {/* Conditional info for template mode */}
          {data.thumbnailMode === 'template' && (
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400">
                Template selection will happen in the detailed settings after pipeline creation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
