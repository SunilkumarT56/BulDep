import {
  LogOut,
  ChevronDown,
  Check,
  MoreHorizontal,
  Youtube,
  BookOpen,
  Gauge,
  LayoutDashboard,
  GraduationCap,
  Terminal,
  Plus,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Logo } from '@/components/Logo';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreatePipelineModal } from './CreatePipelineModal';

interface HeaderProps {
  onLogout: () => void;
  userEmail?: string | null;
  userId?: string | null;
  userAvatarUrl?: string | null;
  userName?: string | null;
}

export function Header({ onLogout, userEmail, userAvatarUrl, userName }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayUsername = userName || (userEmail ? userEmail.split('@')[0] : 'User');

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-16 flex items-center justify-between">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white border border-white/10">
                  <Logo className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-wide hidden sm:inline-block">
                  Zylo
                </span>
              </div>
            </div>

            {/* Separator / Breadcrumb */}
            <div className="h-4 w-[1px] bg-white/10 rotate-[20deg] mx-2" />

            {/* User Profile Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/5 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/50 border border-transparent hover:border-white/5"
              >
                {/* Avatar Gradient or Image */}
                {userAvatarUrl ? (
                  <img
                    src={userAvatarUrl}
                    alt={displayUsername}
                    className="w-5 h-5 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 border border-white/10 shadow-inner" />
                )}

                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors max-w-[150px] truncate hidden sm:inline-block">
                  {displayUsername}
                </span>

                <ChevronDown
                  className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0A]/95 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 p-1 backdrop-blur-2xl"
                  >
                    <div className="p-3 border-b border-white/5 space-y-1 bg-white/5 rounded-t-lg mx-1 mt-1">
                      <p className="text-sm font-medium text-white truncate">{displayUsername}</p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {userEmail || 'No email connected'}
                      </p>
                    </div>

                    <div className="py-1 mt-1">
                      <div className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 bg-white/5 rounded-md mx-1 border border-white/5 cursor-default">
                        <div className="flex items-center gap-2">
                          {userAvatarUrl ? (
                            <img
                              src={userAvatarUrl}
                              alt={displayUsername}
                              className="w-4 h-4 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 flex items-center justify-center text-[8px] text-white font-bold">
                              {displayUsername.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate max-w-[140px]">{displayUsername}</span>
                        </div>
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    </div>

                    <div className="py-1 border-t border-white/5 mt-1">
                      {location.pathname === '/dashboard' ? (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/new');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors text-left font-medium"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-zinc-400" />
                          </div>
                          Create Deployment
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            console.log('Create Pipeline clicked');
                            setIsOpen(false);
                            setIsPipelineModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors text-left font-medium"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-zinc-400" />
                          </div>
                          Create Pipeline
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: More Menu & Log Out */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* More Menu */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center justify-center text-zinc-400 hover:text-white transition-colors outline-none"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A]/95 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 p-2 backdrop-blur-2xl"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {/* Item 1: YT / Dashboard */}
                      {location.pathname === '/yt-pipeline-dashboard' ? (
                        <button
                          onClick={() => {
                            setIsMoreOpen(false);
                            navigate('/dashboard');
                          }}
                          title="Deployments"
                          className="flex items-center justify-center w-full aspect-square text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/5"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsMoreOpen(false);
                            navigate('/yt-pipeline-dashboard');
                          }}
                          title="Youtube Automation"
                          className="flex items-center justify-center w-full aspect-square text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/5"
                        >
                          <Youtube className="w-5 h-5" />
                        </button>
                      )}

                      {/* Item 2: Notion */}
                      <button
                        onClick={() => setIsMoreOpen(false)}
                        title="Notion"
                        className="flex items-center justify-center w-full aspect-square text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/5"
                      >
                        <BookOpen className="w-5 h-5" />
                      </button>

                      {/* Item 3: Google Classroom */}
                      <button
                        onClick={() => setIsMoreOpen(false)}
                        title="Google Classroom Automation"
                        className="flex items-center justify-center w-full aspect-square text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/5"
                      >
                        <GraduationCap className="w-5 h-5" />
                      </button>

                      {/* Item 4: Dev Automation */}
                      <button
                        onClick={() => setIsMoreOpen(false)}
                        title="Dev Automation"
                        className="flex items-center justify-center w-full aspect-square text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/5"
                      >
                        <Terminal className="w-5 h-5" />
                      </button>

                      {/* Item 5: Rate Limiter */}
                      <button
                        onClick={() => setIsMoreOpen(false)}
                        title="Rate Limiter"
                        className="flex items-center justify-center w-full aspect-square text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/5"
                      >
                        <Gauge className="w-5 h-5" />
                      </button>

                      {/* Item 6: Dummy / Placeholder */}
                      <button className="flex items-center justify-center w-full aspect-square text-zinc-500 cursor-not-allowed hover:bg-white/5 rounded-lg border border-transparent">
                        <div className="w-5 h-5 rounded-full border border-zinc-500 border-dashed flex items-center justify-center">
                          <span className="text-[9px] font-bold">?</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="https://github.com/SunilkumarT56/Zylo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
            </a>
            <div className="h-4 w-[1px] bg-white/10" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors rounded-full px-3"
            >
              <LogOut className="mr-2 h-3 w-3" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <CreatePipelineModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
      />
    </>
  );
}
