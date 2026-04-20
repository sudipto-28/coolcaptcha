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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

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

const RecentActivity = () => {
  const activities = [
    {
      icon: ShieldCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
      message: "New security challenge deployed",
      time: "2 minutes ago",
    },
    {
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      message: "User registration spike detected",
      time: "15 minutes ago",
    },
    {
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      message: "Unusual traffic pattern flagged",
      time: "1 hour ago",
    },
    {
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10",
      message: "System health check passed",
      time: "2 hours ago",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel p-6 rounded-xl border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${activity.bg} flex items-center justify-center ${activity.color} shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const SecurityOverview = () => {
  const stats = [
    { label: "Bot Attempts Blocked", value: "98.7%", color: "bg-green-500" },
    { label: "Human Pass Rate", value: "99.9%", color: "bg-blue-500" },
    { label: "Avg Response Time", value: "42ms", color: "bg-purple-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-6 rounded-xl border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4">Security Overview</h3>
      <div className="space-y-4">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="font-mono font-medium">{stat.value}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: i === 2 ? "15%" : "98%" }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={ShieldCheck}
              label="Total Verifications"
              value="2.4M"
              change="+12.5%"
              trend="up"
            />
            <StatCard
              icon={Users}
              label="Active Users"
              value="45.2K"
              change="+8.2%"
              trend="up"
            />
            <StatCard
              icon={AlertTriangle}
              label="Threats Blocked"
              value="1.2M"
              change="+15.3%"
              trend="up"
            />
            <StatCard
              icon={Globe}
              label="Regions Active"
              value="12"
              change="+2"
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
                  <h3 className="text-lg font-semibold">Verification Trends</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      7D
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs bg-primary/10 text-primary">
                      30D
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      90D
                    </Button>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">Chart visualization placeholder</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <RecentActivity />
              <SecurityOverview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
