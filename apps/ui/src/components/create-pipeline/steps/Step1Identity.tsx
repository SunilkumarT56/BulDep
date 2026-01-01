import { useEffect, useState, useCallback } from 'react';
import { usePipelineWizard } from '../PipelineWizardContext';
import { Check, X, Loader2 } from 'lucide-react';

export function Step1Identity({ allowNameEdit = true }: { allowNameEdit?: boolean }) {
  const { data, setData, setValidationErrors, setStepValid } = usePipelineWizard();
  const [localName, setLocalName] = useState(data.pipelineName);
  const [checkingName, setCheckingName] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Constants
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 60;

  const validateName = useCallback(
    async (name: string) => {
      if (!allowNameEdit) return; // Skip validation if readonly
      setCheckingName(true);
      setLocalError(null);
      let isValid = true;
      let errorMsg = '';

      const trimmed = name.trim();

      if (!trimmed) {
        isValid = false;
        if (name.length > 0) errorMsg = 'Name is required';
        else isValid = false;
      } else if (trimmed.length < MIN_LENGTH) {
        isValid = false;
        errorMsg = `Name must be at least ${MIN_LENGTH} characters`;
      } else if (trimmed.length > MAX_LENGTH) {
        isValid = false;
        errorMsg = `Name must be less than ${MAX_LENGTH} characters`;
      } else if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
        isValid = false;
        errorMsg = 'Name cannot contain only symbols';
      } else {
        // Mocked server check
        if (trimmed.toLowerCase() === 'existingpipeline') {
          isValid = false;
          errorMsg = 'Pipeline name already exists';
        }
      }

      if (!isValid && errorMsg) {
        setLocalError(errorMsg);
        setValidationErrors({ pipelineName: errorMsg });
      } else if (isValid) {
        setData({ pipelineName: trimmed });
        setValidationErrors({});
      }

      setStepValid(isValid && trimmed.length > 0);
      setCheckingName(false);
    },
    [setData, setValidationErrors, setStepValid, allowNameEdit],
  );

  useEffect(() => {
    if (!allowNameEdit) return;
    const timer = setTimeout(async () => {
      validateName(localName);
    }, 500);

    return () => clearTimeout(timer);
  }, [localName, validateName, allowNameEdit]);

  const traverseChange = (val: string) => {
    setLocalName(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-white">
          {allowNameEdit ? 'Name your pipeline' : 'General Settings'}
        </h3>
        <p className="text-sm text-zinc-400">
          {allowNameEdit
            ? 'Give your pipeline a unique identifier. This will be used in your dashboard and reports.'
            : 'Configure general identity and appearance settings.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Pipeline Name <span className="text-red-400">*</span>
        </label>
        {!allowNameEdit && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-500 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
            Pipeline name can only be set during creation.
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={localName}
            onChange={(e) => traverseChange(e.target.value)}
            onBlur={() => setLocalName((prev) => prev.trim())}
            disabled={!allowNameEdit}
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
              !allowNameEdit
                ? 'opacity-50 cursor-not-allowed border-transparent'
                : localError
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-white/10 focus:border-white/20 focus:ring-white/20'
            }`}
            placeholder="e.g. Daily Tech News Shorts"
          />
          {allowNameEdit && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checkingName ? (
                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
              ) : localName && !localError ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : localName && localError ? (
                <X className="w-4 h-4 text-red-500" />
              ) : null}
            </div>
          )}
        </div>
        {localError && allowNameEdit && (
          <p className="text-xs text-red-400 flex items-center gap-1">{localError}</p>
        )}
        {allowNameEdit && (
          <p className="text-xs text-zinc-500 text-right">
            {localName.length}/{MAX_LENGTH}
          </p>
        )}
      </div>

      <div className="space-y-5 border border-white/10 rounded-xl p-4 bg-white/5">
        <label className="text-sm font-medium text-zinc-300"></label>
        <div className="grid grid-cols-12 gap-4 w-fit">
          {[
            'linear-gradient(to right, #4f46e5, #9333ea)', // Indigo-Purple
            'linear-gradient(to right, #ec4899, #8b5cf6)', // Pink-Violet
            'linear-gradient(to right, #3b82f6, #06b6d4)', // Blue-Cyan
            'linear-gradient(to right, #10b981, #3b82f6)', // Emerald-Blue
            'linear-gradient(to right, #f59e0b, #ef4444)', // Amber-Red
            'linear-gradient(to right, #84cc16, #10b981)', // Lime-Emerald
            'linear-gradient(to right, #ef4444, #f97316)', // Red-Orange
            'linear-gradient(to right, #d946ef, #ec4899)', // Fuchsia-Pink
            'linear-gradient(to right, #06b6d4, #14b8a6)', // Cyan-Teal
            'linear-gradient(to right, #f97316, #f59e0b)', // Orange-Amber
            'linear-gradient(to right, #14b8a6, #22c55e)', // Teal-Green
            'linear-gradient(to right, #6366f1, #3b82f6)', // Indigo-Blue
            'linear-gradient(to right, #ec4899, #f43f5e)', // Pink-Rose
            'linear-gradient(to right, #a855f7, #ec4899)', // Purple-Pink
            'linear-gradient(to right, #f472b6, #db2777)', // Pink-Pink
            'linear-gradient(to right, #22d3ee, #0ea5e9)', // Cyan-Sky
            'linear-gradient(to right, #fbbf24, #f59e0b)', // Amber-Amber
            'linear-gradient(to right, #a3e635, #65a30d)', // Lime-Lime
            'linear-gradient(to right, #34d399, #059669)', // Emerald-Emerald
            'linear-gradient(to right, #818cf8, #4f46e5)', // Indigo-Indigo
            'linear-gradient(to right, #fb7185, #e11d48)', // Rose-Rose
            'linear-gradient(to right, #c084fc, #9333ea)', // Purple-Purple
            'linear-gradient(to right, #60a5fa, #2563eb)', // Blue-Blue
            'linear-gradient(to right, #94a3b8, #475569)', // Slate-Slate
          ].map((color, idx) => (
            <button
              key={idx}
              onClick={() => setData({ ...data, color })}
              className={`w-10 h-10 rounded-full transition-all ${
                data.color === color
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                  : 'hover:opacity-80 hover:scale-105'
              }`}
              style={{ background: color }}
              aria-label={`Select pipeline color ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
