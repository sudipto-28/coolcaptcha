import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CreateCategoryModal } from "@/components/admin/create-category-modal";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";

const categories = [
  { id: 1, name: "Technology", slug: "technology", description: "Tech news and updates", articleCount: 45, color: "blue" },
  { id: 2, name: "Finance", slug: "finance", description: "Financial news and markets", articleCount: 32, color: "green" },
  { id: 3, name: "Security", slug: "security", description: "Cybersecurity articles", articleCount: 28, color: "violet" },
  { id: 4, name: "Engineering", slug: "engineering", description: "Engineering insights", articleCount: 19, color: "orange" },
  { id: 5, name: "Sports", slug: "sports", description: "Sports news and updates", articleCount: 15, color: "rose" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function Categories() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = (data: { name: string; slug: string; description: string; color: string }) => {
    console.log("Adding category:", data);
    // TODO: Add API call to create category
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      console.log("Deleting category:", categoryToDelete);
      // TODO: Add API call to delete category
      setCategoryToDelete(null);
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
              <h1 className="text-2xl font-bold">Categories</h1>
              <p className="text-sm text-muted-foreground">Manage article categories</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
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
                placeholder="Search categories..."
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Slug</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Color</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Articles</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-muted-foreground bg-black/30 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{category.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${colorMap[category.color]}`}
                      >
                        {category.color}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{category.articleCount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDeleteCategory(category.id)}
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

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
