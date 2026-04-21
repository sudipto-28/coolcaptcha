import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleFeed } from "@/components/articles/article-feed";
import { ArticleDetail } from "@/components/articles/article-detail";
import { Layout } from "@/components/layout/layout";
import { ApiArticle } from "@/components/articles/article-data";

// ===================== CAPTCHA SHELL =====================

const CaptchaShell = ({
  title,
  onRefresh,
  children,
  footer,
}: {
  title: string;
  onRefresh: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => (
  <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl w-full">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Security Check</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="text-muted-foreground hover:text-white transition-colors p-1 rounded"
          title="New challenge"
        >
          <RefreshCw size={13} />
        </button>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">coolcaptcha.com</span>
        <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center text-[8px] text-primary-foreground font-bold">C</div>
      </div>
    </div>
    <p className="text-xs text-center text-muted-foreground mb-3">{title}</p>
    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-3">
      {children}
    </div>
    {footer}
  </div>
);

// ===================== 1. MATCH 3 CAPTCHA =====================

const MATCH3_ICONS = [
  { emoji: "🔷", label: "diamond" },
  { emoji: "🔶", label: "orange-diamond" },
  { emoji: "⭐", label: "star" },
  { emoji: "🎯", label: "target" },
  { emoji: "💎", label: "gem" },
  { emoji: "🎲", label: "dice" },
  { emoji: "🌀", label: "spiral" },
  { emoji: "⚡", label: "bolt" },
  { emoji: "🔮", label: "orb" },
];

function generateMatch3() {
  const shuffled = [...MATCH3_ICONS].sort(() => Math.random() - 0.5).slice(0, 9);
  const adjPairs = [
    [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
    [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8],
  ];
  const pair = adjPairs[Math.floor(Math.random() * adjPairs.length)];
  shuffled[pair[1]] = { ...shuffled[pair[0]] };
  return { icons: shuffled, pair };
}

const Match3Captcha = ({ onSuccess, onRefresh }: { onSuccess: () => void; onRefresh: () => void }) => {
  const [data, setData] = useState(() => generateMatch3());
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"success" | "fail" | null>(null);

  const refresh = () => {
    setData(generateMatch3());
    setSelected(null);
    setResult(null);
    onRefresh();
  };

  const handleClick = (idx: number) => {
    if (result === "success") return;
    if (selected === null) {
      setSelected(idx);
      return;
    }
    if (selected === idx) { setSelected(null); return; }

    const sameIcon = data.icons[idx].label === data.icons[selected].label;
    const r1 = Math.floor(selected / 3), c1 = selected % 3;
    const r2 = Math.floor(idx / 3), c2 = idx % 3;
    const adjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

    if (sameIcon && adjacent) {
      setResult("success");
      setTimeout(onSuccess, 700);
    } else {
      setResult("fail");
      setTimeout(() => { setSelected(null); setResult(null); }, 900);
    }
  };

  return (
    <CaptchaShell title="Click the two adjacent matching icons" onRefresh={refresh}>
      <div className="grid grid-cols-3 gap-2">
        {data.icons.map((icon, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`h-16 rounded-xl text-3xl flex items-center justify-center transition-all border-2 select-none ${
              result === "success" && (i === data.pair[0] || i === data.pair[1])
                ? "border-green-500 bg-green-500/20 scale-95"
                : selected === i
                ? "border-primary bg-primary/20 scale-105 shadow-lg shadow-primary/20"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-102"
            }`}
          >
            {icon.emoji}
          </button>
        ))}
      </div>
      {result === "fail" && (
        <p className="text-xs text-red-400 text-center mt-2 animate-pulse">Not a matching adjacent pair. Try again.</p>
      )}
    </CaptchaShell>
  );
};

// ===================== 3. DRAW / TRACE SHAPE CAPTCHA =====================

const DRAW_SHAPES = [
  {
    name: "M",
    waypoints: [{ x: 10, y: 85 }, { x: 28, y: 15 }, { x: 50, y: 55 }, { x: 72, y: 15 }, { x: 90, y: 85 }],
  },
  {
    name: "W",
    waypoints: [{ x: 10, y: 15 }, { x: 28, y: 85 }, { x: 50, y: 45 }, { x: 72, y: 85 }, { x: 90, y: 15 }],
  },
  {
    name: "Z",
    waypoints: [{ x: 15, y: 15 }, { x: 85, y: 15 }, { x: 15, y: 85 }, { x: 85, y: 85 }],
  },
  {
    name: "N",
    waypoints: [{ x: 15, y: 85 }, { x: 15, y: 15 }, { x: 85, y: 85 }, { x: 85, y: 15 }],
  },
  {
    name: "V",
    waypoints: [{ x: 15, y: 15 }, { x: 50, y: 85 }, { x: 85, y: 15 }],
  },
];

const DrawCaptcha = ({ onSuccess, onRefresh }: { onSuccess: () => void; onRefresh: () => void }) => {
  const [shape] = useState(() => DRAW_SHAPES[Math.floor(Math.random() * DRAW_SHAPES.length)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [clicked, setClicked] = useState<number[]>([]);
  const [error, setError] = useState(false);

  const refresh = () => {
    setCurrentStep(0);
    setClicked([]);
    setError(false);
    onRefresh();
  };

  const handleDotClick = (idx: number) => {
    if (error) return;
    if (idx !== currentStep) {
      setError(true);
      setTimeout(() => { setError(false); setCurrentStep(0); setClicked([]); }, 900);
      return;
    }
    const next = [...clicked, idx];
    setClicked(next);
    if (next.length === shape.waypoints.length) {
      setTimeout(onSuccess, 500);
    } else {
      setCurrentStep(idx + 1);
    }
  };

  return (
    <CaptchaShell
      title={`Follow the line — click dots 1 → ${shape.waypoints.length} in order`}
      onRefresh={refresh}
    >
      <div
        className="relative w-full rounded-lg overflow-hidden"
        style={{ height: 120, background: "#f0e6d3" }}
      >
        {/* Dotted path SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {shape.waypoints.map((pt, i) =>
            i > 0 ? (
              <line
                key={i}
                x1={shape.waypoints[i - 1].x}
                y1={shape.waypoints[i - 1].y}
                x2={pt.x}
                y2={pt.y}
                stroke={clicked.includes(i - 1) && clicked.includes(i) ? "#92400e" : "#c4a882"}
                strokeWidth="2"
                strokeDasharray="4,3"
                strokeLinecap="round"
              />
            ) : null
          )}
          {/* Drawn path highlight */}
          {clicked.length > 1 &&
            clicked.slice(0, -1).map((idx, i) => (
              <line
                key={`drawn-${i}`}
                x1={shape.waypoints[idx].x}
                y1={shape.waypoints[idx].y}
                x2={shape.waypoints[clicked[i + 1]].x}
                y2={shape.waypoints[clicked[i + 1]].y}
                stroke="#92400e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))
          }
        </svg>

        {/* Shape name watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-7xl font-bold text-amber-900/10 select-none">{shape.name}</span>
        </div>

        {/* Clickable dots */}
        {shape.waypoints.map((pt, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`absolute w-8 h-8 rounded-full border-2 font-bold text-xs -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all z-10 ${
              clicked.includes(i)
                ? "bg-amber-700 border-amber-900 text-white scale-90"
                : i === currentStep
                ? "bg-amber-400 border-amber-600 text-amber-900 scale-110 shadow-md animate-pulse"
                : "bg-white/80 border-amber-400/60 text-amber-700 hover:scale-105"
            }`}
            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-400 text-center mt-2 animate-pulse">Wrong order! Start again from 1.</p>
      )}
    </CaptchaShell>
  );
};

// ===================== 3. ODD ONE OUT CAPTCHA =====================

const ODD_ICONS = [
  { emoji: "🐶", label: "dog" },
  { emoji: "🐱", label: "cat" },
  { emoji: "🐸", label: "frog" },
  { emoji: "🐼", label: "panda" },
  { emoji: "🦊", label: "fox" },
  { emoji: "🐨", label: "koala" },
  { emoji: "🐯", label: "tiger" },
  { emoji: "🦁", label: "lion" },
  { emoji: "🐮", label: "cow" },
  { emoji: "🐷", label: "pig" },
];

function generateOddOne() {
  const shuffled = [...ODD_ICONS].sort(() => Math.random() - 0.5);
  const dominantIcon = shuffled[0];
  const uniqueIcon = shuffled[1];
  const uniquePos = Math.floor(Math.random() * 9);
  const grid = Array(9)
    .fill(null)
    .map((_, i) => (i === uniquePos ? { ...uniqueIcon } : { ...dominantIcon }));
  return { grid, uniquePos, uniqueLabel: uniqueIcon.label };
}

const OddOneCaptcha = ({ onSuccess, onRefresh }: { onSuccess: () => void; onRefresh: () => void }) => {
  const [data, setData] = useState(() => generateOddOne());
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"success" | "fail" | null>(null);

  const refresh = () => {
    setData(generateOddOne());
    setSelected(null);
    setResult(null);
    onRefresh();
  };

  const handleClick = (idx: number) => {
    if (result === "success") return;
    setSelected(idx);
    if (idx === data.uniquePos) {
      setResult("success");
      setTimeout(onSuccess, 700);
    } else {
      setResult("fail");
      setTimeout(() => { setSelected(null); setResult(null); }, 900);
    }
  };

  return (
    <CaptchaShell title="Find and click the odd one out" onRefresh={refresh}>
      <div className="grid grid-cols-3 gap-2">
        {data.grid.map((icon, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`h-16 rounded-xl text-3xl flex items-center justify-center transition-all border-2 select-none ${
              result === "success" && i === data.uniquePos
                ? "border-green-500 bg-green-500/20 scale-95"
                : result === "fail" && selected === i
                ? "border-red-500 bg-red-500/20"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-102"
            }`}
          >
            {icon.emoji}
          </button>
        ))}
      </div>
      {result === "fail" && (
        <p className="text-xs text-red-400 text-center mt-2 animate-pulse">That's not it — look more carefully!</p>
      )}
    </CaptchaShell>
  );
};

// ===================== RANDOM CAPTCHA PICKER =====================

type CaptchaKey = "match3" | "draw" | "oddone";

const CAPTCHA_MAP: Record<CaptchaKey, React.FC<{ onSuccess: () => void; onRefresh: () => void }>> = {
  match3: Match3Captcha,
  draw: DrawCaptcha,
  oddone: OddOneCaptcha,
};

const CAPTCHA_KEYS = Object.keys(CAPTCHA_MAP) as CaptchaKey[];

function randomType(): CaptchaKey {
  return CAPTCHA_KEYS[Math.floor(Math.random() * CAPTCHA_KEYS.length)];
}

const RandomCaptcha = ({
  instanceKey,
  onSuccess,
  onRefresh,
}: {
  instanceKey: number;
  onSuccess: () => void;
  onRefresh: () => void;
}) => {
  const [type, setType] = useState<CaptchaKey>(randomType);

  const handleRefresh = () => {
    setType(randomType());
    onRefresh();
  };

  const Component = CAPTCHA_MAP[type];
  return <Component key={`${type}-${instanceKey}`} onSuccess={onSuccess} onRefresh={handleRefresh} />;
};

// ===================== SUCCESS SCREEN =====================

const SuccessScreen = ({ url }: { url: string }) => {
  useEffect(() => {
    if (!url) return;
    const timer = setTimeout(() => { window.location.href = url; }, 2100);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <motion.div
      key="success"
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
      <p className="text-sm text-muted-foreground">
        Redirecting to <span className="text-white font-medium">{url || "your site"}</span>...
      </p>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        />
      </div>
    </motion.div>
  );
};

// ===================== ARTICLES PAGE =====================

interface RedirectUrlEntry {
  id: string;
  name: string | null;
  redirectUrl: string;
  isActive: boolean;
}

export default function Articles() {
  const [step, setStep] = useState(2);
  const [redirectTarget, setRedirectTarget] = useState("");
  const [redirectUrls, setRedirectUrls] = useState<RedirectUrlEntry[]>([]);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<ApiArticle | null>(null);

  useEffect(() => {
    const fetchRedirectUrls = async () => {
      try {
        const response = await fetch("/api/redirect-urls");
        const data: { success: boolean; data: RedirectUrlEntry[] } = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setRedirectUrls(data.data.filter((u) => u.isActive));
        }
      } catch {
        // silently ignore — redirect will just not happen
      }
    };
    fetchRedirectUrls();
  }, []);

  const pickRandomRedirectUrl = () => {
    if (redirectUrls.length === 0) return "";
    return redirectUrls[Math.floor(Math.random() * redirectUrls.length)].redirectUrl;
  };

  const handleSuccess = () => {
    setRedirectTarget(pickRandomRedirectUrl());
    setStep(3);
  };

  const handleRefresh = () => setCaptchaKey((k) => k + 1);

  const handleReset = () => {
    setStep(2);
    setRedirectTarget("");
    setCaptchaKey((k) => k + 1);
    setSelectedArticle(null);
  };

  const handleArticleClick = (article: ApiArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToFeed = () => {
    setSelectedArticle(null);
  };

  return (
    <Layout>

      {/* Hero */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
            {/* <div className="lg:w-72 shrink-0 space-y-4">
              {[
                { n: 1, title: "Configure Target", desc: "Enter the domain you want to protect." },
                { n: 2, title: "Solve Challenge", desc: "Complete a random puzzle to verify." },
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

              {step === 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  Each verification shows a random challenge type. Use the <RefreshCw size={10} className="inline" /> button to get a new one.
                </p>
              )}
            </div> */}

            {/* Right: Simulated Verification Page */}
            <div className="flex-1 w-full">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a10]">
                {/* Browser chrome */}
                <div className="bg-black/60 px-4 py-3 flex items-center gap-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded px-3 py-1 text-xs text-center text-muted-foreground font-mono flex items-center justify-center gap-2">
                    <Lock size={10} />
                    {"verify.coolcaptcha.com/challenge"}
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  <div className="flex flex-col items-center max-w-sm mx-auto">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="glass-panel p-10 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center min-h-[200px] gap-4 w-full"
                        >
                          <ShieldCheck className="w-14 h-14 text-muted-foreground opacity-40" />
                          <p className="text-muted-foreground">Enter a URL below to generate your CAPTCHA</p>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key={`captcha-${captchaKey}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full"
                        >
                          <RandomCaptcha
                            instanceKey={captchaKey}
                            onSuccess={handleSuccess}
                            onRefresh={handleRefresh}
                          />
                        </motion.div>
                      )}

                      {step === 3 && <SuccessScreen url={redirectTarget} />}
                    </AnimatePresence>
                  </div>

                  {selectedArticle ? (
                    <ArticleDetail
                      slug={selectedArticle.slug}
                      onBack={handleBackToFeed}
                    />
                  ) : (
                    <ArticleFeed onArticleClick={handleArticleClick} />
                  )}
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
    </Layout>
  );
}
