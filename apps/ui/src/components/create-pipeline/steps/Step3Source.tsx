import { useEffect } from 'react';
import { usePipelineWizard } from '../PipelineWizardContext';
import { type SourceType } from '../types';
import { Upload, HardDrive, Database, GitBranch } from 'lucide-react';

const SourceOption = ({
  type,
  icon: Icon,
  label,
  desc,
  currentSourceType,
  onSelect,
}: {
  type: SourceType;
  icon: any;
  label: string;
  desc: string;
  currentSourceType: SourceType;
  onSelect: (type: SourceType) => void;
}) => (
  <button
    type="button"
    onClick={() => onSelect(type)}
    className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all w-full text-left ${
      currentSourceType === type
        ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500'
        : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-900'
    }`}
  >
    <div
      className={`p-2 rounded-lg ${
        currentSourceType === type ? 'bg-zinc-800 text-white' : 'bg-zinc-800/50 text-zinc-400'
      }`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="font-medium text-white text-sm">{label}</div>
      <div className="text-xs text-zinc-500">{desc}</div>
    </div>
  </button>
);

export function Step3Source() {
  const { data, setData, setStepValid, validationErrors, setValidationErrors } =
    usePipelineWizard();

  // Validation Logic
  useEffect(() => {
    let isValid = true;

    if (data.sourceType === 'google_drive' && !data.driveFolderId?.trim()) {
      isValid = false;
    }
    if (data.sourceType === 's3') {
      if (!data.s3Bucket?.trim()) isValid = false;
    }
    if (data.sourceType === 'git') {
      if (!data.gitRepoUrl?.trim()) isValid = false;
      if (!data.gitBranch?.trim()) isValid = false;
    }

    setStepValid(isValid);
  }, [data, setStepValid]);

  const handleSourceChange = (val: SourceType) => {
    setData({
      sourceType: val,
      // Reset conditional fields
      driveFolderId: val === 'google_drive' ? '' : undefined,
      s3Bucket: val === 's3' ? '' : undefined,
      s3Prefix: val === 's3' ? '' : undefined,
      gitRepoUrl: val === 'git' ? '' : undefined,
      gitBranch: val === 'git' ? '' : undefined,
      gitPath: val === 'git' ? '' : undefined,
    });
    setValidationErrors({});
  };

  const handleInputChange = (field: keyof typeof data, val: string) => {
    setData({ [field]: val });
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-white">Content Source</h3>
        <p className="text-sm text-zinc-400">Where should we pull content from?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SourceOption
          type="upload"
          icon={Upload}
          label="Direct Upload"
          desc="Upload files manually"
          currentSourceType={data.sourceType}
          onSelect={handleSourceChange}
        />
        <SourceOption
          type="google_drive"
          icon={HardDrive}
          label="Google Drive"
          desc="Sync from Drive folder"
          currentSourceType={data.sourceType}
          onSelect={handleSourceChange}
        />
        <SourceOption
          type="s3"
          icon={Database}
          label="AWS S3"
          desc="Connect S3 bucket"
          currentSourceType={data.sourceType}
          onSelect={handleSourceChange}
        />
        <SourceOption
          type="git"
          icon={GitBranch}
          label="Git Repository"
          desc="Pull from Git repo"
          currentSourceType={data.sourceType}
          onSelect={handleSourceChange}
        />
      </div>

      {/* Conditional Fields */}
      <div className="pt-4 border-t border-white/10 mt-4 min-h-[150px]">
        {data.sourceType === 'upload' && (
          <div className="text-center py-8 text-zinc-500 italic">
            Files will be uploaded in the next step or during execution.
          </div>
        )}

        {data.sourceType === 'google_drive' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Folder ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.driveFolderId || ''}
                onChange={(e) => handleInputChange('driveFolderId', e.target.value)}
                placeholder="e.g. 1ABC...XYZ"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          </div>
        )}

        {data.sourceType === 's3' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                S3 Bucket Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.s3Bucket || ''}
                onChange={(e) => handleInputChange('s3Bucket', e.target.value)}
                placeholder="my-content-bucket"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Prefix (Optional)</label>
              <input
                type="text"
                value={data.s3Prefix || ''}
                onChange={(e) => handleInputChange('s3Prefix', e.target.value)}
                placeholder="raw-videos/"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          </div>
        )}

        {data.sourceType === 'git' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Repository URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.gitRepoUrl || ''}
                onChange={(e) => handleInputChange('gitRepoUrl', e.target.value)}
                placeholder="https://github.com/user/repo.git"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Branch <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.gitBranch || ''}
                  onChange={(e) => handleInputChange('gitBranch', e.target.value)}
                  placeholder="main"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Path</label>
                <input
                  type="text"
                  value={data.gitPath || ''}
                  onChange={(e) => handleInputChange('gitPath', e.target.value)}
                  placeholder="/content"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
