import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";

const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "violet", label: "Violet", class: "bg-violet-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" },
];

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug: string; description: string; color: string }) => void;
}

export const CreateCategoryModal = ({ isOpen, onClose, onSubmit }: CreateCategoryModalProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    onSubmit({ name, slug, description, color });
    setName("");
    setSlug("");
    setDescription("");
    setColor("blue");
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
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
                <h2 className="text-lg font-semibold">Add Category</h2>
                <p className="text-sm text-muted-foreground">Create a new article category</p>
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
                onChange={handleNameChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                required
                placeholder="technology"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
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
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      color === option.value
                        ? `${option.class} border-white scale-110`
                        : `${option.class} border-transparent opacity-50 hover:opacity-100 hover:scale-105`
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/20 hover:bg-white/5">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Add Category
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
