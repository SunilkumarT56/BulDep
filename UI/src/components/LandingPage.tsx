import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary font-sans">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white tracking-tight">BulDep</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-white/20">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="h-9 px-4 bg-white text-black hover:bg-zinc-200 font-medium text-sm transition-all rounded-md">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white pb-2"
          >
            Infrastructure that works quietly while you <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 drop-shadow-[0_0_15px_rgba(138,43,226,0.5)]">ship faster</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Ship applications faster with automated builds and global deployments.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/signup">
                <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-semibold text-base rounded-full transition-all duration-300">
                Start Building
                </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
