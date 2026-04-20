import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CreateRSSFeedModal } from "@/components/admin/create-rss-feed-modal";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";

const rssFeeds = [
  { id: 1, name: "TechCrunch", url: "https://techcrunch.com/feed/", status: "Active", articles: 234, lastUpdated: "2 hours ago" },
  { id: 2, name: "Hacker News", url: "https://news.ycombinator.com/rss", status: "Active", articles: 567, lastUpdated: "1 hour ago" },
  { id: 3, name: "The Verge", url: "https://www.theverge.com/rss/index.xml", status: "Active", articles: 189, lastUpdated: "3 hours ago" },
  { id: 4, name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", status: "Inactive", articles: 145, lastUpdated: "1 day ago" },
  { id: 5, name: "Wired", url: "https://www.wired.com/feed/rss", status: "Active", articles: 312, lastUpdated: "4 hours ago" },
];

export default function RSSFeeds() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState<number | null>(null);

  const filteredFeeds = rssFeeds.filter(
    (feed) =>
      feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feed.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFeed = (data: { name: string; url: string }) => {
    console.log("Adding RSS feed:", data);
    // TODO: Add API call to create RSS feed
  };

  const handleDeleteFeed = (id: number) => {
    setFeedToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteFeed = () => {
    if (feedToDelete) {
      console.log("Deleting RSS feed:", feedToDelete);
      // TODO: Add API call to delete RSS feed
      setFeedToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">RSS Feeds</h1>
              <p className="text-sm text-muted-foreground">Manage your RSS feed sources</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Feed
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search feeds..."
                className="w-full bg-black/50 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl border border-white/10 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">URL</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Articles</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Last Updated</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeeds.map((feed) => (
                  <tr key={feed.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{feed.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground truncate max-w-xs">{feed.url}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feed.status === "Active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {feed.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{feed.articles}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{feed.lastUpdated}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDeleteFeed(feed.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>

      <CreateRSSFeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddFeed}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteFeed}
        title="Delete RSS Feed"
        message="Are you sure you want to delete this RSS feed? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
