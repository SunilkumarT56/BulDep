import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Loader2, Youtube, Video, Users, Eye, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChannelStats {
  subscribers: string;
  totalViews: string;
  videoCount: string;
}

interface ChannelThumbnail {
  url: string;
  width: number;
  height: number;
}

interface ChannelThumbnails {
  default: ChannelThumbnail;
  medium: ChannelThumbnail;
  high: ChannelThumbnail;
}

interface ChannelData {
  id: string;
  title: string;
  description: string;
  thumbnails: ChannelThumbnails;
  stats: ChannelStats;
  uploadsPlaylistId: string;
}

interface Pipeline {
  name: string;
  admin_name: string;
  color?: string;
  _id?: string;
}

export function YtPipelineDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  useEffect(() => {
    const checkPermission = async () => {
      let token = localStorage.getItem('authToken');

      if (!token) {
        console.log('Using fallback hardcoded token for dashboard');
        token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDUyMTFkMi1kODY5LTQwMTctYjdkNi01NDljMTQzYTYyYmQiLCJpYXQiOjE3NjcwMjIyNjQsImV4cCI6MTc2NzYyNzA2NH0.EA5Pfu0vIkHI5SatbEbZ6HLw2y6QStoXOALz5cRJTiM';
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Channel Info
        const response = await fetch(
          'https://untolerative-len-rumblingly.ngrok-free.dev/user/yt-pipeline/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.responsePayload && data.responsePayload.success) {
            setHasPermission(true);
            setChannelData(data.responsePayload.channel);
            setUserEmail(data.responsePayload.email);

            // 2. Fetch Pipelines (only if authenticated)
            try {
              const pipelinesResponse = await fetch(
                'https://untolerative-len-rumblingly.ngrok-free.dev/user/dashboard/pipeline',
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                  },
                },
              );
              if (pipelinesResponse.ok) {
                const pipelinesData = await pipelinesResponse.json();
                // Assuming the API returns the array directly or in a wrapper
                // Adjust based on actual response structure if needed.
                // Based on "get the response as object name , admin_name", lets assume it might be a list of these objects.
                // If it returns { pipelines: [...] } I'll need to adjust.
                // For now, I'll assume it returns the array or check for a property.
                if (Array.isArray(pipelinesData)) {
                  setPipelines(pipelinesData);
                } else if (pipelinesData.pipelines && Array.isArray(pipelinesData.pipelines)) {
                  setPipelines(pipelinesData.pipelines);
                } else if (pipelinesData.name) {
                  // Single object case
                  setPipelines([pipelinesData]);
                }
              }
            } catch (err) {
              console.error('Failed to fetch pipelines', err);
            }
          } else {
            setHasPermission(false);
          }
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Permission check failed', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="text-center z-10 p-8 border border-white/10 bg-zinc-950/50 backdrop-blur-xl rounded-2xl max-w-md w-full mx-4">
          <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Youtube className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">Connect YouTube</h1>
          <p className="text-zinc-400 mb-6 text-sm">
            Connect your YouTube account to access the automation pipeline.
          </p>
          <Button
            onClick={() =>
              (window.location.href =
                'https://untolerative-len-rumblingly.ngrok-free.dev/auth/google')
            }
            className="w-full bg-white text-black hover:bg-zinc-200 font-bold"
          >
            Connect Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen opacity-20" />
      </div>

      <Header
        onLogout={handleLogout}
        userEmail={userEmail}
        userAvatarUrl={channelData?.thumbnails.high.url}
        userName={channelData?.title}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Overview Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              <span className="text-white">YouTube Automation</span> Pipeline
            </h1>
            <p className="text-sm text-zinc-500">
              Manage your automated content creation pipeline.
            </p>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar - Profile Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Channel Profile Card */}
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 rounded-full" />
                  <img
                    src={channelData?.thumbnails.high.url}
                    alt={channelData?.title}
                    className="h-24 w-24 rounded-full border-2 border-white/10 object-cover relative z-10 shadow-2xl"
                  />
                  <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-black z-20">
                    YT
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{channelData?.title}</h3>
                <p className="text-xs text-zinc-500 mb-6 line-clamp-2 max-w-[200px]">
                  {channelData?.description || 'No description available'}
                </p>

                <div className="grid grid-cols-3 gap-2 w-full pt-6 border-t border-white/5">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Subs
                    </span>
                    <span className="text-sm font-bold text-white">
                      {channelData?.stats.subscribers}
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-l border-white/5">
                    <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Views
                    </span>
                    <span className="text-sm font-bold text-white max-w-full truncate px-1">
                      {channelData?.stats.totalViews}
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-l border-white/5">
                    <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Video className="h-3 w-3" /> Vids
                    </span>
                    <span className="text-sm font-bold text-white">
                      {channelData?.stats.videoCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Card */}
            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="relative text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Automation Active
              </h3>
              <p className="relative text-xs text-zinc-500 mb-4 leading-relaxed">
                Your pipeline is monitoring for new content triggers.
              </p>
              <Button
                variant="link"
                className="relative p-0 h-auto text-xs text-white hover:text-zinc-300 font-medium flex items-center gap-1"
              >
                View Logs <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {pipelines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pipelines.map((pipeline, index) => (
                  <div
                    key={pipeline._id || index}
                    className="relative group rounded-xl border border-white/10 bg-zinc-950/50 p-5 hover:bg-zinc-900/50 transition-all cursor-pointer overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 w-1 h-full opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: pipeline.color || '#3B82F6' }}
                    />

                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full border border-white/10 bg-black/50 overflow-hidden flex-shrink-0">
                        {channelData?.thumbnails.high.url ? (
                          <img
                            src={channelData.thumbnails.high.url}
                            alt="Channel"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <Youtube className="w-5 h-5 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate pr-2">{pipeline.name}</h4>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="text-xs text-zinc-400 truncate font-medium">
                            {channelData?.title}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-500">Admin:</span>
                            <span className="text-xs text-zinc-300 truncate">
                              {pipeline.admin_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Active
                      </span>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                        Pipeline
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Video className="h-8 w-8 text-zinc-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No active automations</h3>
                <p className="text-zinc-500 max-w-md mb-8">
                  Get started by creating your first video generation pipeline. You can automate
                  fetching, editing, and uploading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
