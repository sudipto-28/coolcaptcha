import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ShieldCheck, 
  Code, 
  Zap, 
  Users, 
  Lock, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            C
          </div>
          <span className="font-bold text-xl tracking-tight">CoolCaptcha</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">How it Works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</a>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-white transition-colors">Demo</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-sm">Sign In</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            Get API Key
          </Button>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl"
          >
            <a href="#how-it-works" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#demo" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Demo</a>
            <a href="#pricing" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <div className="h-px bg-white/10 my-2" />
            <Button variant="outline" className="w-full justify-center">Sign In</Button>
            <Button className="w-full justify-center bg-primary text-primary-foreground">Get API Key</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-6">
              <Zap size={14} />
              <span>v2.0 is now live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Stop Bots. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Keep Real Users.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Advanced CAPTCHA protection with dynamic challenges and content-aware security. Enterprise-grade bot protection without frustrating your actual customers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 border-white/20 hover:bg-white/5">
                <PlayCircle className="mr-2 w-4 h-4" /> Try Demo
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Free tier available</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> 2-minute setup</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-muted-foreground font-mono">coolcaptcha.js</div>
              </div>
              
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                
                <div className="mt-8 p-4 rounded-lg bg-background/50 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-sm border border-white/20 flex items-center justify-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.3 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </motion.div>
                    </div>
                    <span className="text-sm font-medium">Verify you are human</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Protected by</span>
                    <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center text-[8px] text-primary-foreground font-bold">C</div>
                  </div>
                </div>
                
                <div className="h-10 bg-primary/20 rounded mt-4 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">Submit Form</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { value: "10M+", label: "Verifications / Day" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "< 50ms", label: "Response Time" },
    { value: "0%", label: "Real User Friction" },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { title: "Generate Site Key", description: "Create an account and get your unique site key in seconds." },
    { title: "Add JS Snippet", description: "Drop our lightweight script tag into your website's <head>." },
    { title: "Protect Instantly", description: "Bots are blocked automatically. Real users pass seamlessly." }
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Developer-First Integration</h2>
          <p className="text-muted-foreground text-lg">
            Add enterprise-grade bot protection to any website in under two minutes. No complex backend routing required.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
              <div className="bg-black/50 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">index.html</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
                  <code className="language-html">
                    <span className="text-blue-400">&lt;!DOCTYPE html&gt;</span>{`\n`}
                    <span className="text-blue-400">&lt;html</span> <span className="text-green-400">lang</span>=<span className="text-yellow-300">"en"</span><span className="text-blue-400">&gt;</span>{`\n`}
                    <span className="text-blue-400">&lt;head&gt;</span>{`\n`}
                    {`  `}...{`\n`}
                    {`  `}<span className="text-gray-500">&lt;!-- Add CoolCaptcha --&gt;</span>{`\n`}
                    {`  `}<span className="text-blue-400">&lt;script</span> <span className="text-green-400">src</span>=<span className="text-yellow-300">"https://coolcaptcha.com/api.js"</span> <span className="text-green-400">data-sitekey</span>=<span className="text-yellow-300">"YOUR_KEY"</span><span className="text-blue-400">&gt;&lt;/script&gt;</span>{`\n`}
                    <span className="text-blue-400">&lt;/head&gt;</span>{`\n`}
                    <span className="text-blue-400">&lt;body&gt;</span>{`\n`}
                    {`  `}<span className="text-blue-400">&lt;form</span> <span className="text-green-400">action</span>=<span className="text-yellow-300">"/login"</span> <span className="text-green-400">method</span>=<span className="text-yellow-300">"POST"</span><span className="text-blue-400">&gt;</span>{`\n`}
                    {`    `}...{`\n`}
                    {`    `}<span className="text-gray-500">&lt;!-- Widget automatically renders here --&gt;</span>{`\n`}
                    {`    `}<span className="text-blue-400">&lt;div</span> <span className="text-green-400">class</span>=<span className="text-yellow-300">"coolcaptcha-widget"</span><span className="text-blue-400">&gt;&lt;/div&gt;</span>{`\n`}
                    {`    `}<span className="text-blue-400">&lt;button</span> <span className="text-green-400">type</span>=<span className="text-yellow-300">"submit"</span><span className="text-blue-400">&gt;</span>Login<span className="text-blue-400">&lt;/button&gt;</span>{`\n`}
                    {`  `}<span className="text-blue-400">&lt;/form&gt;</span>{`\n`}
                    <span className="text-blue-400">&lt;/body&gt;</span>{`\n`}
                    <span className="text-blue-400">&lt;/html&gt;</span>
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Block Bots & Scrapers", desc: "Advanced heuristics detect automated behavior in milliseconds." },
    { icon: <Lock className="w-6 h-6" />, title: "Protect Forms", desc: "Keep your login, signup, and checkout pages safe from credential stuffing." },
    { icon: <Zap className="w-6 h-6" />, title: "Smart Challenges", desc: "Difficulty adapts based on user behavior and IP reputation." },
    { icon: <Users className="w-6 h-6" />, title: "Frictionless", desc: "Trusted users pass without solving any puzzles. Zero friction." },
    { icon: <Server className="w-6 h-6" />, title: "Content-Aware", desc: "Validation that understands the context of the page it's embedded on." },
    { icon: <Code className="w-6 h-6" />, title: "Lightweight", desc: "Minimal payload size. Doesn't slow down your page load times." },
  ];

  return (
    <section id="features" className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Engineered Security</h2>
          <p className="text-muted-foreground text-lg">
            We built CoolCaptcha to solve the tradeoff between security and user experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="glass-panel p-6 rounded-xl hover:border-primary/50 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InteractiveDemoSection = () => {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [verifying, setVerifying] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setStep(2);
  };

  const handleVerify = () => {
    if (sliderValue < 95) return;
    setVerifying(true);
    setTimeout(() => {
      setStep(3);
      setVerifying(false);
    }, 1500);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Experience the seamless verification process. Our dynamic challenges ensure real users get through quickly while bots hit a brick wall.
            </p>
            
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border transition-all ${step === 1 ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                <h3 className="font-medium mb-2">1. Configure Target</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter the domain you want to protect.</p>
                <form onSubmit={handleGenerate} className="flex gap-2">
                  <input 
                    type="url" 
                    required
                    placeholder="https://example.com" 
                    className="flex-1 bg-black/50 border border-white/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={step !== 1}
                  />
                  <Button type="submit" disabled={step !== 1 || !url} className="bg-primary text-primary-foreground">
                    Generate
                  </Button>
                </form>
              </div>

              <div className={`p-4 rounded-lg border transition-all ${step === 2 ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                <h3 className="font-medium mb-2">2. Solve Challenge</h3>
                <p className="text-sm text-muted-foreground">Complete the verification puzzle to proceed.</p>
              </div>

              <div className={`p-4 rounded-lg border transition-all ${step === 3 ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                <h3 className="font-medium mb-2">3. Verification Complete</h3>
                <p className="text-sm text-muted-foreground">User is securely verified and redirected.</p>
              </div>
            </div>
            
            {step === 3 && (
              <Button 
                variant="outline" 
                className="mt-8"
                onClick={() => { setStep(1); setUrl(""); setSliderValue(0); }}
              >
                Reset Demo
              </Button>
            )}
          </div>
          
          <div className="flex-1 w-full flex justify-center">
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center aspect-square"
                  >
                    <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">Waiting for configuration...</p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#121216] shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-medium">Security Check</span>
                      <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-[10px] text-primary-foreground font-bold">C</div>
                    </div>
                    
                    <div className="bg-black/40 border border-white/5 rounded-lg p-4 mb-6">
                      <p className="text-sm text-center mb-4">Slide to complete the puzzle</p>
                      
                      <div className="relative h-32 bg-gray-800 rounded overflow-hidden mb-4 border border-white/10">
                        {/* Puzzle background pattern */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWYyOTM3Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-50" />
                        
                        {/* Puzzle hole */}
                        <div className="absolute top-8 right-8 w-16 h-16 bg-black/60 rounded shadow-inner" />
                        
                        {/* Puzzle piece */}
                        <motion.div 
                          className="absolute top-8 left-2 w-16 h-16 bg-primary/80 backdrop-blur rounded border border-white/30 shadow-lg flex items-center justify-center"
                          style={{ left: `calc(${sliderValue}% * 0.7 + 8px)` }}
                        >
                          <Lock className="w-6 h-6 text-white/70" />
                        </motion.div>
                      </div>
                      
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="w-full accent-primary"
                        disabled={verifying}
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-primary text-primary-foreground"
                      onClick={handleVerify}
                      disabled={sliderValue < 95 || verifying}
                    >
                      {verifying ? (
                        <div className="flex items-center gap-2">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Verifying...
                        </div>
                      ) : "Solve CAPTCHA"}
                    </Button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel p-8 rounded-2xl border border-green-500/30 flex flex-col items-center justify-center text-center aspect-square bg-green-500/5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">Verification Complete</h3>
                    <p className="text-muted-foreground text-sm">Redirecting to {url}...</p>
                    
                    <motion.div 
                      className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden"
                    >
                      <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CaptchaPreviewSection = () => {
  return (
    <section className="py-24 bg-black/40 border-y border-white/5 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Content-Rich Verification</h2>
          <p className="text-muted-foreground text-lg">
            Turn your CAPTCHA page into an engagement opportunity. Webmasters choose what content appears via RSS feeds (tech, finance, sports, etc.).
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-background">
          {/* Browser Header */}
          <div className="bg-black/60 px-4 py-3 flex items-center gap-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 bg-white/5 rounded px-3 py-1 text-xs text-center text-muted-foreground font-mono flex items-center justify-center gap-2">
              <Lock size={10} /> https://verify.coolcaptcha.com/challenge
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-8 md:p-12 flex flex-col items-center bg-gradient-to-b from-background to-background/50">
            {/* The CAPTCHA Box */}
            <div className="w-full max-w-md bg-[#121216] border border-white/10 rounded-xl p-6 mb-12 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary w-5 h-5" />
                    <span className="font-medium">Security Check</span>
                  </div>
                  <div className="text-xs text-muted-foreground">coolcaptcha.com</div>
                </div>
                <div className="bg-black/50 border border-white/5 rounded-lg p-4 text-center">
                   <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                   <p className="text-sm">Verifying browser securely...</p>
                </div>
            </div>

            {/* Content Feed */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Latest News</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-video bg-white/5 rounded-lg mb-3 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                           <Zap className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                    <div className="h-4 bg-white/10 rounded w-full mb-2 group-hover:bg-white/20 transition-colors" />
                    <div className="h-4 bg-white/10 rounded w-2/3 group-hover:bg-white/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdvancedFeaturesSection = () => {
  const features = [
    "Dynamic CAPTCHA difficulty",
    "Behavioral analysis",
    "Anti-bypass protection",
    "REST API integration",
    "Custom content feeds (RSS)",
    "Automatic redirection",
    "Detailed analytics dashboard",
    "Customizable themes"
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise-Grade Architecture</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Under the hood, CoolCaptcha uses advanced machine learning models to analyze hundreds of signals in real-time, distinguishing between malicious bots and legitimate users with unprecedented accuracy.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-[100px]" />
              <div className="glass-panel p-8 rounded-2xl border border-white/10 relative">
                <div className="space-y-6">
                  {[
                    { label: "Bot Traffic Blocked", value: "98.7%", width: "98%" },
                    { label: "Real User Pass Rate", value: "99.9%", width: "99%" },
                    { label: "Average Latency", value: "42ms", width: "15%" }
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-300">{stat.label}</span>
                        <span className="text-primary font-mono">{stat.value}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: "0%" }}
                          whileInView={{ width: stat.width }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Protecting Your Website Today</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of webmasters who trust CoolCaptcha to keep their platforms secure and their users happy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
              Create Free API Key
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 hover:bg-white/5">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              C
            </div>
            <span className="font-bold tracking-tight text-white">CoolCaptcha</span>
          </div>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">API Reference</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025 CoolCaptcha.com. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <BenefitsSection />
        <InteractiveDemoSection />
        <CaptchaPreviewSection />
        <AdvancedFeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
