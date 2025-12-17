import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ArrowRight, Loader2, ExternalLink, UploadCloud, Server, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!uploadId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/status?id=${uploadId}`);
        const data = await response.json();
        // Backend returns { status: string | null }
        // If status is null (not found yet), we might be pending or starting
        setStatus(data.status || "Pending...");
      } catch (e) {
        // Silently fail
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 1000); // Poll every 1 second
    return () => clearInterval(interval);
  }, [uploadId]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const { left, top } = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: clientX - left,
      y: clientY - top,
    });
  };

  const handleDeploy = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setDeployedUrl(null);
    setStatus("uploading"); // Initial optimistic status
    
    try {
      const response = await fetch("http://localhost:7002/api/upload/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: url }),
      });

      if (!response.ok) {
        throw new Error("Deployment failed");
      }

      const data = await response.json();
      const id = data.id; // Correctly use the ID from the response
      console.log("Received ID from 7001:", id);

      if (id) {
        setUploadId(id);
        // Construct the full URL.
        const fullUrl = `http://${id}.sunilkumar.com:3001`;
        setDeployedUrl(fullUrl);
      } else {
        setError("Invalid response from server");
        setStatus(""); // Reset status on error
      }
    } catch (err) {
      console.error(err);
      setError("Failed to deploy. Please check the URL and try again.");
      setStatus(""); // Reset status on error
    } finally {
      setLoading(false);
    }
  };



  return (
    <div 
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white pt-16"
        onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
            style={{
                maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)'
            }}
          />
          
          {/* Cursor Wave Effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
            }}
          />

          <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3], 
            }}
            transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut" 
            }}
            className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500/20 opacity-20 blur-[100px]"
          />
          <motion.div
             animate={{
                x: ["-25%", "25%"],
                y: ["-10%", "10%"],
             }}
             transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
             }}
             className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#ffffff09,transparent)]"
          />
      </div>
      
      <div className="z-10 flex flex-col items-center gap-8 px-4 text-center w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-extrabold text-transparent sm:text-7xl tracking-tighter">
            Ship your project <br /> in seconds.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
            The frontend cloud for every framework. <br/> Deploy the future with Buildep.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="flex w-full max-w-md flex-col items-center gap-4 sm:flex-row"
        >
            <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Github className="h-5 w-5" />
                </div>
                <Input 
                    type="text" 
                    placeholder="github.com/username/repo" 
                    className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-lg focus-visible:ring-white/20"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                onClick={handleDeploy}
                disabled={loading || !url}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deploying...
                    </>
                ) : (
                    <>
                        Deploy <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="mt-6"
        >
             {status && (
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg hover:bg-white/10 transition-colors">
                <div className={`relative h-2.5 w-2.5 flex items-center justify-center`}>
                     <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        status === 'uploading' ? 'bg-purple-500' :
                        status === 'deploying' ? 'bg-blue-500' :
                        status === 'builded' ? 'bg-green-500' :
                        'bg-zinc-500'
                     }`}></span>
                     <span className={`relative inline-flex h-2 w-2 rounded-full ${
                        status === 'uploading' ? 'bg-purple-500' :
                        status === 'deploying' ? 'bg-blue-500' :
                        status === 'builded' ? 'bg-green-500' :
                        'bg-zinc-500'
                     }`}></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-300 capitalize">
                        {status === 'builded' ? 'Build Complete' : status}
                    </span>
                    {status === 'uploading' && <UploadCloud className="h-4 w-4 text-purple-400" />}
                    {status === 'deploying' && <Server className="h-4 w-4 text-blue-400" />}
                    {status === 'builded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
             </div>
             )}
        </motion.div>

        {/* Result Box - Only changes is positioning logic might be needed if it overlaps, but standard flow puts it below */}
        {deployedUrl && status === 'builded' && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mt-4"
            >
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                     <span className="pl-2 text-sm text-zinc-400">Deployed:</span>
                     <a 
                        href={deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="flex-1 text-sm font-medium text-white hover:text-blue-400 transition-colors truncate text-center"
                     >
                        {deployedUrl.replace(/^https?:\/\//, '')}
                     </a>
                     <div className="flex items-center gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
                            onClick={() => navigator.clipboard.writeText(deployedUrl)}
                        >
                            <span className="sr-only">Copy</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                         <a 
                            href={deployedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                             <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </a>
                     </div>
                </div>
            </motion.div>
        )}

        {error && (
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-sm"
             >
                {error}
             </motion.div>
        )}
      </div>
    </div>
  );
}
