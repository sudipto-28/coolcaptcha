import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Lock,
  ExternalLink,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            C
          </div>
          <span className="font-bold text-xl tracking-tight">CoolCaptcha</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">How it Works</Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</Link>
          <Link href="/demo" className="text-sm text-white font-medium">Demo</Link>
          <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-sm">Sign In</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            Get API Key
          </Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl"
          >
            <Link href="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/demo" className="text-lg font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>Demo</Link>
            <div className="h-px bg-white/10 my-2" />
            <Button variant="outline" className="w-full justify-center">Sign In</Button>
            <Button className="w-full justify-center bg-primary text-primary-foreground">Get API Key</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const articles = [
  {
    category: "Technology",
    title: "How AI is reshaping cybersecurity in 2025",
    excerpt: "Machine learning models are now capable of detecting novel attack patterns hours before human analysts — here's what that means for your stack.",
    readTime: "4 min read",
    color: "from-blue-500/20 to-cyan-500/10",
    dot: "bg-blue-400",
  },
  {
    category: "Finance",
    title: "DeFi protocols see record bot activity following market rally",
    excerpt: "Automated trading bots accounted for nearly 62% of all on-chain transaction volume last quarter. Analysts say the trend is accelerating.",
    readTime: "3 min read",
    color: "from-emerald-500/20 to-green-500/10",
    dot: "bg-emerald-400",
  },
  {
    category: "Security",
    title: "The anatomy of a credential stuffing attack",
    excerpt: "A step-by-step breakdown of how modern bots bypass basic CAPTCHA solutions and what defenses actually hold up under pressure.",
    readTime: "6 min read",
    color: "from-violet-500/20 to-purple-500/10",
    dot: "bg-violet-400",
  },
  {
    category: "Engineering",
    title: "Building abuse-resilient APIs: lessons from scale",
    excerpt: "Rate limiting alone won't save you. Here's the layered approach used by teams handling tens of millions of requests per day.",
    readTime: "5 min read",
    color: "from-orange-500/20 to-amber-500/10",
    dot: "bg-orange-400",
  },
  {
    category: "Sports",
    title: "Ticketing platforms battle bots ahead of playoff season",
    excerpt: "With high-demand events selling out in seconds, the arms race between scalper bots and CAPTCHA providers has reached a new peak.",
    readTime: "2 min read",
    color: "from-rose-500/20 to-red-500/10",
    dot: "bg-rose-400",
  },
  {
    category: "Technology",
    title: "WebAssembly is making browser fingerprinting harder to block",
    excerpt: "A new generation of bot frameworks uses WASM modules to evade traditional detection. Here's the technical explanation.",
    readTime: "7 min read",
    color: "from-sky-500/20 to-blue-500/10",
    dot: "bg-sky-400",
  },
];

const ArticleFeed = () => (
  <div className="w-full mt-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px bg-white/10 flex-1" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
        <Zap size={12} className="text-primary" />
        Curated for your industry via RSS
      </div>
      <div className="h-px bg-white/10 flex-1" />
    </div>
    <p className="text-center text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
      Webmasters choose what content appears below the CAPTCHA — tech, finance, sports, and more — keeping users engaged while verification runs.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="group glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className={`h-32 bg-gradient-to-br ${article.color} flex items-center justify-center relative overflow-hidden`}>
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-black/40 backdrop-blur text-white/80">
                <span className={`w-1.5 h-1.5 rounded-full ${article.dot}`} />
                {article.category}
              </span>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock size={10} />
              {article.readTime}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const CaptchaWidget = ({ step, sliderValue, setSliderValue, verifying, handleVerify, url }: {
  step: number;
  sliderValue: number;
  setSliderValue: (v: number) => void;
  verifying: boolean;
  handleVerify: () => void;
  url: string;
}) => (
  <AnimatePresence mode="wait">
    {step === 1 && (
      <motion.div
        key="step1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel p-10 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center min-h-[200px] gap-4"
      >
        <ShieldCheck className="w-14 h-14 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground">Enter a URL below to generate your CAPTCHA</p>
      </motion.div>
    )}

    {step === 2 && (
      <motion.div
        key="step2"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Security Check</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">coolcaptcha.com</span>
            <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center text-[8px] text-primary-foreground font-bold">C</div>
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 rounded-xl p-5 mb-4">
          <p className="text-sm text-center text-muted-foreground mb-5">Slide the puzzle piece to the correct position</p>

          <div className="relative h-28 bg-gray-900 rounded-lg overflow-hidden mb-5 border border-white/10">
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #1a2035 0px, #1a2035 10px, #111827 10px, #111827 20px)"
              }}
            />
            <div className="absolute top-6 right-10 w-16 h-16 rounded-md border-2 border-dashed border-primary/40 bg-black/40" />
            <motion.div
              className="absolute top-6 left-0 w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-md shadow-lg flex items-center justify-center border border-white/20"
              style={{ left: `calc(${Math.min(sliderValue, 100) * 0.6}% + 8px)` }}
              animate={{ boxShadow: sliderValue >= 95 ? "0 0 20px rgba(0,230,255,0.5)" : "0 4px 20px rgba(0,0,0,0.5)" }}
            >
              <div className="w-6 h-6 border-2 border-white/40 rounded" />
            </motion.div>
          </div>

          <div className="relative">
            <input
              type="range"
              min={0}
              max={100}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>

        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          disabled={sliderValue < 95 || verifying}
          onClick={handleVerify}
        >
          {verifying ? (
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</span>
          ) : sliderValue < 95 ? (
            "Slide puzzle to unlock"
          ) : (
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Confirm Verification</span>
          )}
        </Button>
      </motion.div>
    )}

    {step === 3 && (
      <motion.div
        key="step3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel p-10 rounded-2xl border border-green-500/30 flex flex-col items-center justify-center text-center gap-4 bg-green-500/5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <h3 className="text-xl font-bold">Verification Complete</h3>
        <p className="text-sm text-muted-foreground">Redirecting to {url || "your site"}...</p>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Demo() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [verifying, setVerifying] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setSliderValue(0);
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

  const handleReset = () => {
    setStep(1);
    setUrl("");
    setSliderValue(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-5">
              <Zap size={13} /> Interactive Demo
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Try CoolCaptcha Yourself</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Enter your domain, solve the challenge, and see exactly how the verification experience works for your users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left: Steps */}
            <div className="lg:w-72 shrink-0 space-y-4">
              {[
                { n: 1, title: "Configure Target", desc: "Enter the domain you want to protect." },
                { n: 2, title: "Solve Challenge", desc: "Complete the slider puzzle to verify." },
                { n: 3, title: "Verified", desc: "User is verified and redirected." },
              ].map(({ n, title, desc }) => (
                <div
                  key={n}
                  className={`p-4 rounded-xl border transition-all ${
                    step === n
                      ? "bg-primary/5 border-primary/30"
                      : step > n
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-white/[0.02] border-white/10 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${
                      step > n ? "bg-green-500/20 text-green-400" : step === n ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                    }`}>
                      {step > n ? <CheckCircle2 size={13} /> : n}
                    </div>
                    <span className="font-medium text-sm">{title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-9">{desc}</p>
                </div>
              ))}

              <form onSubmit={handleGenerate} className="flex flex-col gap-2 pt-2">
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={step !== 1}
                />
                {step === 1 ? (
                  <Button type="submit" disabled={!url} className="w-full bg-primary text-primary-foreground">
                    Generate CAPTCHA <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={handleReset} className="w-full border-white/20 hover:bg-white/5">
                    Reset Demo
                  </Button>
                )}
              </form>
            </div>

            {/* Right: Simulated Verification Page */}
            <div className="flex-1 w-full">
              {/* Browser chrome */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a10]">
                <div className="bg-black/60 px-4 py-3 flex items-center gap-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded px-3 py-1 text-xs text-center text-muted-foreground font-mono flex items-center justify-center gap-2">
                    <Lock size={10} />
                    {url ? `verify.coolcaptcha.com/challenge?site=${encodeURIComponent(url)}` : "verify.coolcaptcha.com/challenge"}
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  {/* CAPTCHA widget centered */}
                  <div className="flex flex-col items-center max-w-sm mx-auto">
                    <CaptchaWidget
                      step={step}
                      sliderValue={sliderValue}
                      setSliderValue={setSliderValue}
                      verifying={verifying}
                      handleVerify={handleVerify}
                      url={url}
                    />
                  </div>

                  {/* Articles below — always visible */}
                  <ArticleFeed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-black py-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">C</div>
              <span className="font-bold tracking-tight text-white">CoolCaptcha</span>
            </Link>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">API Reference</a>
              <a href="#" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 text-xs text-muted-foreground text-center">
            © 2025 CoolCaptcha.com. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
