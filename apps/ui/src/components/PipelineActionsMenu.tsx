import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreHorizontal,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Users,
  FileText,
  BarChart2,
  History,
  Copy,
  Link,
  CreditCard,
  Archive,
  Shield,
  Trash2,
  Activity,
  Layers,
  Zap,
  Globe,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuOption {
  label: string;
  action: string;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: MenuOption[];
}

const MENU_DATA: MenuCategory[] = [
  {
    id: 'core',
    label: 'Core Pipeline Actions',
    icon: <Zap className="w-4 h-4" />,
    options: [
      { label: 'Open / View pipeline', action: 'view', icon: <Layers className="w-4 h-4" /> },
      { label: 'Start automation', action: 'start', icon: <Play className="w-4 h-4" /> },
      { label: 'Pause automation', action: 'pause', icon: <Pause className="w-4 h-4" /> },
      { label: 'Resume automation', action: 'resume', icon: <Play className="w-4 h-4" /> },
      { label: 'Dry run (simulate)', action: 'dry_run', icon: <Activity className="w-4 h-4" /> },
      { label: 'Run pipeline now', action: 'run_now', icon: <Zap className="w-4 h-4" /> },
      { label: 'Run specific step', action: 'run_step', icon: <Layers className="w-4 h-4" /> },
    ],
  },
  {
    id: 'config',
    label: 'Configuration & Settings',
    icon: <Settings className="w-4 h-4" />,
    options: [
      { label: 'Edit pipeline name', action: 'edit_name' },
      { label: 'Configure content source', action: 'config_source' },
      { label: 'Configure YouTube channel', action: 'config_channel' },
      { label: 'Upload rules', action: 'rules_upload' },
      { label: 'Scheduling rules', action: 'rules_sched', icon: <Clock className="w-4 h-4" /> },
      { label: 'Metadata strategy', action: 'meta_strat' },
      { label: 'Thumbnail rules', action: 'thumb_rules' },
      { label: 'Language & region', action: 'lang_settings', icon: <Globe className="w-4 h-4" /> },
    ],
  },
  {
    id: 'workflow',
    label: 'Workflow & Team',
    icon: <Users className="w-4 h-4" />,
    options: [
      { label: 'View members', action: 'view_members' },
      { label: 'Invite members', action: 'invite_members' },
      { label: 'Change roles', action: 'change_roles' },
      { label: 'Remove members', action: 'remove_members', danger: true },
      { label: 'Approval flow', action: 'approval_flow' },
      { label: 'Configure stages', action: 'config_stages' },
    ],
  },
  {
    id: 'content',
    label: 'Content & Automation',
    icon: <FileText className="w-4 h-4" />,
    options: [
      { label: 'View queued content', action: 'view_queued' },
      { label: 'View processed', action: 'view_processed' },
      { label: 'Retry failed jobs', action: 'retry_failed' },
      { label: 'Skip a job', action: 'skip_job' },
      { label: 'Cancel running job', action: 'cancel_job', danger: true },
      { label: 'Manual override', action: 'manual_override' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Intelligence',
    icon: <BarChart2 className="w-4 h-4" />,
    options: [
      { label: 'Analytics dashboard', action: 'analytics_dash' },
      { label: 'Video performance', action: 'vid_perf' },
      { label: 'CTR tracking', action: 'ctr_track' },
      { label: 'Retention analysis', action: 'retention' },
      { label: 'Underperforming alerts', action: 'perf_alerts' },
      { label: 'Comparison', action: 'comparison' },
    ],
  },
  {
    id: 'logs',
    label: 'Logs & History',
    icon: <History className="w-4 h-4" />,
    options: [
      { label: 'Execution logs', action: 'exec_logs' },
      { label: 'Error logs', action: 'error_logs', icon: <AlertTriangle className="w-4 h-4" /> },
      { label: 'Retry history', action: 'retry_hist' },
      { label: 'Download logs', action: 'dl_logs' },
      { label: 'Audit trail', action: 'audit_trail' },
    ],
  },
  {
    id: 'experiment',
    label: 'Experimentation',
    icon: <Activity className="w-4 h-4" />,
    options: [
      { label: 'Clone pipeline', action: 'clone', icon: <Copy className="w-4 h-4" /> },
      { label: 'Create from template', action: 'template' },
      { label: 'Convert type', action: 'convert' },
      { label: 'A/B test metadata', action: 'ab_meta' },
      { label: 'A/B test thumbnails', action: 'ab_thumb' },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Link className="w-4 h-4" />,
    options: [
      { label: 'Enable webhooks', action: 'webhooks' },
      { label: 'Slack/Discord alerts', action: 'alerts' },
      { label: 'Event triggers', action: 'events' },
      { label: 'API access', action: 'api_access' },
    ],
  },
  {
    id: 'cost',
    label: 'Cost & Usage',
    icon: <CreditCard className="w-4 h-4" />,
    options: [
      { label: 'API quota usage', action: 'quota' },
      { label: 'Storage usage', action: 'storage' },
      { label: 'Processing cost', action: 'cost' },
      { label: 'Monthly summary', action: 'summary' },
    ],
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle',
    icon: <Archive className="w-4 h-4" />,
    options: [
      { label: 'Archive pipeline', action: 'archive' },
      { label: 'Restore pipeline', action: 'restore' },
      { label: 'Transfer owner', action: 'transfer' },
      {
        label: 'Delete pipeline',
        action: 'delete',
        danger: true,
        icon: <Trash2 className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'security',
    label: 'Security & Safety',
    icon: <Shield className="w-4 h-4" />,
    options: [
      { label: 'Permission matrix', action: 'permissions' },
      { label: 'Restrict actions', action: 'restrict' },
      { label: 'Copyright warnings', action: 'copyright' },
      { label: 'Policy checks', action: 'policy' },
    ],
  },
];

export function PipelineActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the button and the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', () => setIsOpen(false)); // Close on resize to avoid position issues
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
      setActiveCategory(null);
      return;
    }

    // Calculate position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position menu to the right of the button (Sidebar Flyout style)
      setMenuPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 10, // Add some spacing
      });
      setIsOpen(true);
    }
  };

  const handleOptionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Action triggered:', action);
    setIsOpen(false);
    setActiveCategory(null);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`p-1.5 rounded-lg transition-colors ${
          isOpen
            ? 'bg-[#2F2F2F] text-[#D4D4D4]'
            : 'text-zinc-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 pointer-events-none" style={{ top: 0, left: 0 }}>
              {/* Main Menu Container - pointer-events-auto to allow interaction */}
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                className="fixed w-64 rounded-lg border border-[#2F2F2F] bg-[#191919] shadow-xl pointer-events-auto flex flex-col"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1.5 flex flex-col">
                  {MENU_DATA.map((category) => {
                    const isActive = activeCategory === category.id;

                    return (
                      <div
                        key={category.id}
                        className="relative group px-1"
                        onMouseEnter={() => setActiveCategory(category.id)}
                      >
                        <button
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? 'bg-[#2F2F2F] text-[#D4D4D4]'
                              : 'text-[#9B9A97] hover:text-[#D4D4D4] hover:bg-[#2F2F2F]'
                          }`}
                          onClick={() => setActiveCategory(isActive ? null : category.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`${
                                isActive
                                  ? 'text-[#D4D4D4]'
                                  : 'text-[#9B9A97] group-hover:text-[#D4D4D4]'
                              }`}
                            >
                              {category.icon}
                            </span>
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-[#9B9A97] ${isActive ? 'text-[#D4D4D4]' : ''}`}
                          />
                        </button>

                        {/* Submenu Flyout */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, x: -10, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -10, scale: 0.95 }}
                              transition={{ duration: 0.15, ease: 'easeOut' }}
                              className="absolute left-full top-0 ml-2 w-60 rounded-lg border border-[#2F2F2F] bg-[#191919] shadow-xl overflow-hidden z-50 pointer-events-auto"
                            >
                              <div className="py-1.5 flex flex-col max-h-[320px] overflow-y-auto custom-scrollbar">
                                <div className="px-3 py-2 text-xs font-semibold text-[#9B9A97] uppercase tracking-wider border-b border-[#2F2F2F] mb-1">
                                  {category.label}
                                </div>
                                {category.options.map((option, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => handleOptionClick(option.action, e)}
                                    className={`
                                      w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors relative rounded-md
                                      ${
                                        option.danger
                                          ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                                          : 'text-[#D4D4D4] hover:bg-[#2F2F2F]'
                                      }
                                    `}
                                  >
                                    {option.icon ? (
                                      <span
                                        className={`flex-shrink-0 w-4 h-4 flex items-center justify-center ${
                                          option.danger ? 'text-red-500' : 'text-[#9B9A97]'
                                        }`}
                                      >
                                        {option.icon}
                                      </span>
                                    ) : (
                                      <div className="w-4 h-4 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{option.label}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
