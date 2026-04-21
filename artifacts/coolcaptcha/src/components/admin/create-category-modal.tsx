import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderTree, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void> | void;
  categoryToEdit?: { name: string; description: string } | null;
}

export const CreateCategoryModal = ({ isOpen, onClose, onSubmit, categoryToEdit }: CreateCategoryModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsLoading(true);
    setError("");

    try {
      await onSubmit({ name, description });
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
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
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md glass-panel rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{categoryToEdit ? "Edit Category" : "Add Category"}</h2>
                <p className="text-sm text-muted-foreground">{categoryToEdit ? "Update article category" : "Create a new article category"}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Technology"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Brief description of the category"
                rows={3}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                    {categoryToEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  categoryToEdit ? "Update Category" : "Add Category"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
