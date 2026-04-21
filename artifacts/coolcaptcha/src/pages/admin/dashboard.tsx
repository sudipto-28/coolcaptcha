import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Globe,
  BarChart3,
  FileText,
  Rss,
  FolderTree,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getStats } from "@/lib/stats-api";

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel p-6 rounded-xl border border-white/10"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-medium ${
          trend === "up" ? "text-green-400" : "text-red-400"
        }`}
      >
        <TrendingUp className="w-3 h-3" />
        {change}
      </div>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

const RecentActivity = ({ latestPosts }: { latestPosts: any[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel p-6 rounded-xl border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4">Latest Articles</h3>
      <div className="space-y-4">
        {latestPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles yet</p>
        ) : (
          latestPosts.map((post: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"
              >
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.publishedAt}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.category} • {post.source}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const SecurityOverview = ({ categoryBreakdown, topSources }: { categoryBreakdown: any[]; topSources: any[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-6 rounded-xl border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4">Content Overview</h3>
      <div className="space-y-6">
        {/* Category Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-3">Categories (Today)</h4>
          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-muted-foreground">No articles today</p>
          ) : (
            <div className="space-y-2">
              {categoryBreakdown.slice(0, 3).map((cat: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-medium">{cat.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / Math.max(...categoryBreakdown.map((c: any) => c.count), 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Sources */}
        <div>
          <h4 className="text-sm font-medium mb-3">Top Sources</h4>
          {topSources.length === 0 ? (
            <p className="text-xs text-muted-foreground">No sources yet</p>
          ) : (
            <div className="space-y-2">
              {topSources.slice(0, 3).map((source: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Rss className="w-3 h-3" />
                  </div>
                  <span className="flex-1 truncate">{source.name}</span>
                  <span className="font-medium">{source.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
  });

  const stats = statsData?.stats;
  const latestPosts = statsData?.latestPosts || [];
  const categoryBreakdown = statsData?.categoryBreakdown || [];
  const topSources = statsData?.topSources || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5">
                <Activity className="w-4 h-4 mr-2" />
                View Logs
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Run Security Check
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                  icon={FileText}
                  label="Total Articles"
                  value={stats?.totalPosts?.toString() || "0"}
                  change={stats?.postsTrend !== undefined && stats.postsTrend >= 0 ? `+${stats.postsTrend}%` : `${stats?.postsTrend || 0}%`}
                  trend={stats?.postsTrend !== undefined && stats.postsTrend >= 0 ? "up" : "down"}
                />
                <StatCard
                  icon={FileText}
                  label="Today's Articles"
                  value={stats?.todayPosts?.toString() || "0"}
                  change={stats?.postsTrend !== undefined && stats.postsTrend >= 0 ? `+${stats.postsTrend}%` : `${stats?.postsTrend || 0}%`}
                  trend={stats?.postsTrend !== undefined && stats.postsTrend >= 0 ? "up" : "down"}
                />
                <StatCard
                  icon={FolderTree}
                  label="Categories"
                  value={stats?.totalCategories?.toString() || "0"}
                  change="+0%"
                  trend="up"
                />
                <StatCard
                  icon={Rss}
                  label="Active Sources"
                  value={stats?.totalActiveSources?.toString() || "0"}
                  change="+0%"
                  trend="up"
                />
              </div>

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Latest Articles</h3>
                    </div>
                    <div className="space-y-4">
                      {latestPosts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No articles yet</p>
                      ) : (
                        latestPosts.map((post: any, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div
                              className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"
                            >
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{post.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {post.publishedAt}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">{post.category}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{post.source}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <SecurityOverview categoryBreakdown={categoryBreakdown} topSources={topSources} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
