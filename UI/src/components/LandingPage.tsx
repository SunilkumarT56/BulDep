import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden selection:bg-violet-500/30 selection:text-violet-200 font-sans">
      {/* Premium Dark Background */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
          {/* Defined grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_100%,transparent_100%)]"></div>
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white tracking-tight">Zylo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="h-9 px-4 bg-white text-black hover:bg-zinc-200 font-medium text-sm transition-all rounded-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-16 px-4">
        <div className="relative w-full max-w-[95%] 2xl:max-w-7xl mx-auto space-y-16">
            
            {/* HEROL: Code with Freedom (Promoted from Card) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] p-8 sm:p-12 md:p-16 group min-h-[50vh] flex flex-col justify-center"
            >
                 <div className="relative z-20 max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20" />
                        </div>
                        <div className="h-px bg-white/5 flex-1 w-32 max-w-[100px]" />
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
                        Code with freedom. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">Deploy with control.</span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8">
                         Push to git and let our automated build system handle the rest.
                         Instant rollbacks, preview deployments, and zero-downtime shipping.
                    </p>

                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-bold text-base rounded-full shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.4)] transition-all">
                                Start Deploying
                            </Button>
                        </Link>
                         <Button variant="outline" size="lg" className="h-12 px-8 border-white/10 text-white hover:bg-white/5 hover:text-white rounded-full text-base font-medium">
                            Documentation
                        </Button>
                    </div>
                 </div>

                 {/* Hero Visual: Huge Code Editor Abstract */}
                 <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 translate-x-[10%] w-[700px] h-[500px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none select-none hidden lg:block rotate-[-5deg]">
                     <div className="font-mono text-base space-y-3 text-violet-200/50">
                         <div className="flex"><span className="text-zinc-600 w-12">01</span> <span className="text-fuchsia-400">export</span> <span className="text-blue-400">default</span> <span className="text-yellow-300">function</span> <span className="text-blue-300">Deploy</span>() {'{'}</div>
                         <div className="flex"><span className="text-zinc-600 w-12">02</span> &nbsp;&nbsp;<span className="text-fuchsia-400">const</span> <span className="text-blue-200">grid</span> = <span className="text-green-400">new</span> <span className="text-yellow-300">ScaleGrid</span>();</div>
                         <div className="flex"><span className="text-zinc-600 w-12">03</span> &nbsp;&nbsp;<span className="text-fuchsia-400">await</span> grid.<span className="text-blue-300">connect</span>(<span className="text-orange-300">"global-edge"</span>);</div>
                         <div className="flex"><span className="text-zinc-600 w-12">04</span> </div>
                         <div className="flex"><span className="text-zinc-600 w-12">05</span> &nbsp;&nbsp;<span className="text-fuchsia-400">return</span> (</div>
                         <div className="flex"><span className="text-zinc-600 w-12">06</span> &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-green-400">Sphere</span></div>
                         <div className="flex"><span className="text-zinc-600 w-12">07</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">region</span>=<span className="text-orange-300">"auto"</span></div>
                         <div className="flex"><span className="text-zinc-600 w-12">08</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">latency</span>=<span className="text-yellow-300">{'{'}0{'}'}</span></div>
                         <div className="flex"><span className="text-zinc-600 w-12">09</span> &nbsp;&nbsp;&nbsp;&nbsp;/&gt;</div>
                         <div className="flex"><span className="text-zinc-600 w-12">10</span> &nbsp;&nbsp;);</div>
                         <div className="flex"><span className="text-zinc-600 w-12">11</span> {'}'}</div>
                         <div className="flex"><span className="text-zinc-600 w-12">12</span> <span className="text-zinc-500">// Deploying to production...</span></div>
                     </div>
                 </div>
                 
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Row 2: Infrastructure Quote */}
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-8">
                 <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white max-w-5xl leading-tight">
                    Infrastructure that works quietly while <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">you ship faster.</span>
                </h2>
                <p className="text-lg text-zinc-400 max-w-2xl">
                    Ship applications faster with automated builds and global deployments.
                </p>
                <Link to="/signup">
                    <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-bold text-base rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transition-all">
                        Start Building
                    </Button>
                </Link>
            </div>



            {/* Feature Grid (Remaining Items) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Block 1: Global Edge (Expanded to 2 cols for balance) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] p-10 sm:p-12 flex flex-col justify-between group lg:col-span-2 min-h-[400px]"
                >
                     <div className="relative z-10 w-full mb-8">
                         {/* World Map Background */}
                         <div className="absolute inset-0 -top-10 opacity-30 select-none">
                             <svg viewBox="0 0 100 50" fill="none" className="w-full h-full text-white/20">
                                 <path d="M10 25 Q 30 5, 50 25 T 90 25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                                 <path d="M5 35 Q 25 10, 55 35 T 95 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                                 <path d="M20 45 Q 40 20, 60 40 T 80 15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
                             </svg>
                             {/* Pulsing Dots */}
                             <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                             <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-purple-500 rounded-full animate-ping delay-700" />
                             <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-ping delay-300" />
                              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-fuchsia-500 rounded-full animate-ping delay-500" />
                         </div>
                     </div>
                     
                     <div className="relative z-10 max-w-lg">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Global Edge Network</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Deploy your application to <span className="text-white font-medium">35+ regions worldwide</span> in seconds. Zylo automatically routes users to the nearest edge location for ultra-low latency.
                        </p>
                     </div>
                </motion.div>

                {/* Block 2: Instant Previews */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-md p-8 sm:p-10 flex flex-col group lg:col-span-1 min-h-[400px]"
                >
                     <div className="relative z-10 flex-1 flex items-center justify-center mb-8">
                         {/* Mock Browser Window */}
                         <div className="w-full aspect-[4/3] bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-500">
                             <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-3 gap-2">
                                 <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                                 <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                 <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                                 <div className="ml-2 h-4 w-full bg-white/5 rounded-full" />
                             </div>
                             <div className="p-4 flex flex-col items-center justify-center h-full relative">
                                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                 <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-3 animate-bounce">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                     </svg>
                                 </div>
                                 <div className="h-2.5 w-24 bg-zinc-800 rounded mb-2" />
                                 <div className="h-2.5 w-16 bg-zinc-800 rounded" />
                             </div>
                         </div>
                     </div>
                     
                     <div className="relative z-10 mt-auto">
                        <h3 className="text-2xl font-bold text-white mb-3">Instant Previews</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            Every git shift creates a unique <span className="text-white">Preview URL</span> to share with your team.
                        </p>
                     </div>
                </motion.div>

                {/* Block 3: Scaling (Large) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black p-10 sm:p-14 flex flex-col items-center text-center group lg:col-span-3 min-h-[300px]"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                    
                    <div className="relative z-10">
                         <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-zinc-300 mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            99.99% Uptime SLA
                         </div>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium text-white mb-6">
                            Scale to <span className="font-serif italic text-zinc-500">infinity</span>
                        </h2>
                        <p className="text-zinc-400 max-w-lg mx-auto mb-8">
                            Whether you have 10 users or 10 million, your infrastructure scales automatically with zero configuration.
                        </p>
                    </div>
                </motion.div>

                {/* Block 4: CTA Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
                    {/* Left CTA: Primary */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/40 p-10 sm:p-14 flex flex-col justify-center items-start group min-h-[300px]"
                    >
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Ready to lift off?
                        </h3>
                        <p className="text-zinc-400 mb-8 max-w-xs text-lg">
                            Start building with a free account. No credit card required.
                        </p>
                        <Link to="/signup">
                            <Button className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-full shadow-lg transition-all">
                                Start for Free
                            </Button>
                        </Link>
                         <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </motion.div>

                    {/* Right CTA: Enterprise */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-black p-10 sm:p-14 flex flex-col justify-center items-start group min-h-[300px]"
                    >
                         <div className="absolute inset-0 bg-zinc-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-3xl font-bold text-white mb-4 relative z-10">
                            Enterprise
                        </h3>
                        <p className="text-zinc-500 mb-8 max-w-xs relative z-10 text-lg">
                           Custom infrastructure, SLA guarantees, and dedicated engineering support.
                        </p>
                        <Button variant="outline" className="h-14 px-8 border-white/10 text-white hover:bg-white/5 hover:text-white rounded-full relative z-10 text-lg">
                            Contact Sales
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
