import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { CreateArticleInput, UpdateArticleInput } from "@/lib/articles-api";
import { getCategories } from "@/lib/categories-api";
import type { Category } from "@/lib/categories-api";
import { getUsers } from "@/lib/users-api";
import type { User } from "@/lib/users-api";

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateArticleInput) => Promise<void> | void;
  articleToEdit?: CreateArticleInput | null;
}

export const CreateArticleModal = ({ isOpen, onClose, onSubmit, articleToEdit }: CreateArticleModalProps) => {
  const [authorId, setAuthorId] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED">("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const filterableCategories = categories.filter((cat: Category) => cat.isFilterable);

  // Populate form when editing
  useEffect(() => {
    if (articleToEdit) {
      setAuthorId(articleToEdit.authorId);
      setTitle(articleToEdit.title);
      setExcerpt(articleToEdit.excerpt || "");
      setContent(articleToEdit.content || "");
      setStatus(articleToEdit.status || "DRAFT");
      setCategoryId(articleToEdit.categoryId || "");
      setSourceId(articleToEdit.sourceId || "");
    } else {
      setAuthorId("");
      setTitle("");
      setExcerpt("");
      setContent("");
      setStatus("DRAFT");
      setCategoryId("");
      setSourceId("");
    }
  }, [articleToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authorId) return;

    setIsLoading(true);
    setError("");

    try {
      await onSubmit({
        authorId,
        title,
        excerpt: excerpt || undefined,
        content: content || undefined,
        status,
        categoryId: categoryId || undefined,
        sourceId: sourceId || undefined,
      });
      setAuthorId("");
      setTitle("");
      setExcerpt("");
      setContent("");
      setStatus("DRAFT");
      setCategoryId("");
      setSourceId("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{articleToEdit ? "Edit Article" : "Add Article"}</h2>
                <p className="text-sm text-muted-foreground">{articleToEdit ? "Update article content" : "Create a new article"}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Author *</label>
              <select
                required
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
              >
                <option value="">Select an author</option>
                {users.map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                required
                placeholder="Article title"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                placeholder="Brief summary of the article"
                rows={2}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                placeholder="Full article content"
                rows={6}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED")}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="REVIEW">Review</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">No category</option>
                  {filterableCategories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Source ID</label>
              <input
                type="text"
                placeholder="Source ID (optional)"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setError("");
                  onClose();
                }}
                disabled={isLoading}
                className="flex-1 border-white/20 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {articleToEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  articleToEdit ? "Update Article" : "Create Article"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
