import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";

const articles = [
  {
    id: 1,
    title: "How AI is reshaping cybersecurity in 2025",
    category: "Technology",
    status: "Published",
    readTime: "4 min read",
    publishedAt: "2025-04-15",
    views: 1234,
  },
  {
    id: 2,
    title: "DeFi protocols see record bot activity following market rally",
    category: "Finance",
    status: "Published",
    readTime: "3 min read",
    publishedAt: "2025-04-14",
    views: 856,
  },
  {
    id: 3,
    title: "The anatomy of a credential stuffing attack",
    category: "Security",
    status: "Published",
    readTime: "6 min read",
    publishedAt: "2025-04-13",
    views: 2341,
  },
  {
    id: 4,
    title: "Building abuse-resilient APIs: lessons from scale",
    category: "Engineering",
    status: "Draft",
    readTime: "5 min read",
    publishedAt: null,
    views: 0,
  },
  {
    id: 5,
    title: "Ticketing platforms battle bots ahead of playoff season",
    category: "Sports",
    status: "Published",
    readTime: "2 min read",
    publishedAt: "2025-04-12",
    views: 567,
  },
];

export default function AdminArticles() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteArticle = (id: number) => {
    setArticleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteArticle = () => {
    if (articleToDelete) {
      console.log("Deleting article:", articleToDelete);
      // TODO: Add API call to delete article
      setArticleToDelete(null);
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
              <h1 className="text-2xl font-bold">Articles</h1>
              <p className="text-sm text-muted-foreground">Manage your article content</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Article
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
                placeholder="Search articles..."
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Read Time</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Published</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Views</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium max-w-md">{article.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{article.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === "Published"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {article.publishedAt || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">{article.views}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDeleteArticle(article.id)}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteArticle}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
