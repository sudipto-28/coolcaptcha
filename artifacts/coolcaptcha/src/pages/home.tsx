import React from "react";
import { motion } from "framer-motion";
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
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/layout";
import { Footer } from "@/components/footer";

// --- Components ---

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
              <Link href="/articles">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 border-white/20 hover:bg-white/5">
                  <PlayCircle className="mr-2 w-4 h-4" /> Try Demo
                </Button>
              </Link>
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

export default function Home() {
  return (
    <Layout>
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <BenefitsSection />
        <AdvancedFeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </Layout>
  );
}
