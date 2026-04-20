export const articles = [
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

export type Article = typeof articles[number];
