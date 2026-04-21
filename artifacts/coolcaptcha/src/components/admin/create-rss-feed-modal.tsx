import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rss, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateRSSFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; rssUrl: string; websiteUrl?: string; isActive?: boolean; fetchInterval?: number }) => Promise<void> | void;
  feedToEdit?: { name: string; rssUrl: string; websiteUrl?: string; isActive?: boolean; fetchInterval?: number } | null;
}

export const CreateRSSFeedModal = ({ isOpen, onClose, onSubmit, feedToEdit }: CreateRSSFeedModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [fetchInterval, setFetchInterval] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (feedToEdit) {
      setName(feedToEdit.name);
      setUrl(feedToEdit.rssUrl);
      setWebsiteUrl(feedToEdit.websiteUrl || "");
      setIsActive(feedToEdit.isActive ?? true);
      setFetchInterval(feedToEdit.fetchInterval ?? 20);
    } else {
      setName("");
      setUrl("");
      setWebsiteUrl("");
      setIsActive(true);
      setFetchInterval(20);
    }
  }, [feedToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setIsLoading(true);
    setError("");

    try {
      await onSubmit({ name, rssUrl: url, websiteUrl, isActive, fetchInterval });
      setName("");
      setUrl("");
      setWebsiteUrl("");
      setIsActive(true);
      setFetchInterval(20);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create RSS feed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md glass-panel rounded-2xl border border-white/10 p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Rss className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{feedToEdit ? "Edit RSS Feed" : "Add RSS Feed"}</h2>
                <p className="text-sm text-muted-foreground">{feedToEdit ? "Update RSS feed source" : "Add a new RSS feed source"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Feed Name</label>
              <input
                type="text"
                required
                placeholder="e.g., TechCrunch"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">RSS URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com/feed"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fetch Interval (minutes)</label>
              <input
                type="number"
                min="1"
                required
                placeholder="20"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                value={fetchInterval}
                onChange={(e) => setFetchInterval(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
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
                    {feedToEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  feedToEdit ? "Update Feed" : "Add Feed"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
