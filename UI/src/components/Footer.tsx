import { Monitor, Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-black py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Links */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
          <a href="#" className="hover:text-zinc-300 transition-colors flex items-center gap-2">
            <div className="w-5 h-5 opacity-80">
                <Logo />
            </div>
          </a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Home</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Docs</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Knowledge Base</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Academy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">SDKs</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Help</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Contact</a>
          <a href="#" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
            Legal
            <span className="text-[10px] transform rotate-90">›</span>
          </a>
        </div>

        {/* Right Side: Status & Theme */}
        <div className="flex items-center gap-6">
          
          {/* Status */}
          <div className="flex items-center gap-2 text-sm text-blue-500 font-medium">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            All systems normal.
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-1 border border-zinc-800 rounded-md p-1 bg-zinc-900/50">
            <button className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
                <Sun className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 rounded bg-zinc-800 text-zinc-200 shadow-sm transition-colors">
                <Moon className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
                <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
