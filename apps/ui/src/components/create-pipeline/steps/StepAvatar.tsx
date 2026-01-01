import { motion } from 'framer-motion';
import { Upload, Globe, Image as ImageIcon, X } from 'lucide-react';
import { usePipelineWizard } from '../PipelineWizardContext';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function StepAvatar() {
  const { data, setData, setStepValid } = usePipelineWizard();
  const [activeTab, setActiveTab] = useState<'upload' | 'web'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.userAvatar || null);

  useEffect(() => {
    setStepValid(true);
  }, [setStepValid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setData({ userAvatar: url, userAvatarFile: file });
    }
  };

  const clearAvatar = () => {
    setPreviewUrl(null);
    setData({ userAvatar: undefined, userAvatarFile: undefined });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">Pipeline Avatar</h3>
        <p className="text-zinc-400">
          Upload an icon or search for one to represent your pipeline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-800/50 rounded-lg max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'upload'
              ? 'bg-[#2F2F2F] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <button
          onClick={() => setActiveTab('web')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'web'
              ? 'bg-[#2F2F2F] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          Web Search
        </button>
      </div>

      <div className="max-w-md mx-auto min-h-[300px]">
        {activeTab === 'upload' ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#2F2F2F] hover:border-zinc-500 rounded-xl p-8 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer relative group bg-[#191919]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#2F2F2F] group-hover:border-white/20 transition-colors">
                  <img
                    src={previewUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover bg-neutral-900"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#252525] flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="text-center">
                <p className="text-white font-medium">Click to upload</p>
                <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </div>
            {previewUrl && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAvatar}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Avatar
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#191919] border border-[#2F2F2F] rounded-xl p-8 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto text-zinc-500">
              <Globe className="w-8 h-8" />
            </div>
            <h4 className="text-white font-medium">Search the Web</h4>
            <p className="text-sm text-zinc-500">Find an icon from the web (Dummy Feature)</p>
            <div className="flex gap-2">
              <Input
                placeholder="Search keywords..."
                className="bg-[#252525] border-[#2F2F2F] text-white"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  alert('Web search is a dummy feature for now.');
                }}
              >
                Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
