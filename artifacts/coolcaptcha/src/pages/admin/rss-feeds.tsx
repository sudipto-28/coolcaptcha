import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";
import { CreateRSSFeedModal } from "@/components/admin/create-rss-feed-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type {
  CreateSourceInput,
  Source,
  UpdateSourceInput,
} from "@/lib/sources-api";
import {
  createSource,
  deleteSource,
  getSources,
  updateSource,
} from "@/lib/sources-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Edit,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const sourcesQueryKey = ["sources"] as const;

function formatDate(value: string | null) {
  if (!value) return "Never";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function RSSFeeds() {
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState<Source | null>(null);
  const [feedToEdit, setFeedToEdit] = useState<Source | null>(null);

  const {
    data: rssFeeds = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: sourcesQueryKey,
    queryFn: getSources,
  });

  const createFeedMutation = useMutation({
    mutationFn: (data: CreateSourceInput) => createSource(data),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "RSS feed added",
        description: "The new source is ready to use.",
      });
    },
  });

  const deleteFeedMutation = useMutation({
    mutationFn: (id: string) => deleteSource(id),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "RSS feed deleted",
        description: "The source has been removed.",
      });
    },
    onError: (deleteError) => {
      toast({
        title: "Could not delete feed",
        description:
          deleteError instanceof Error
            ? deleteError.message
            : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFeedMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSourceInput }) =>
      updateSource(id, data),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "RSS feed updated",
        description: "The source has been updated successfully.",
      });
    },
    onError: (updateError) => {
      toast({
        title: "Could not update feed",
        description:
          updateError instanceof Error
            ? updateError.message
            : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddFeed = async (data: CreateSourceInput) => {
    await createFeedMutation.mutateAsync(data);
  };

  const handleEditFeed = (feed: Source) => {
    setFeedToEdit(feed);
    setIsModalOpen(true);
  };

  const handleUpdateFeed = async (data: CreateSourceInput) => {
    if (feedToEdit) {
      await updateFeedMutation.mutateAsync({ id: feedToEdit.id, data });
      setFeedToEdit(null);
    }
  };

  const handleDeleteFeed = (feed: Source) => {
    setFeedToDelete(feed);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteFeed = async () => {
    if (feedToDelete) {
      await deleteFeedMutation.mutateAsync(feedToDelete.id);
      setFeedToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedToEdit(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">RSS Feeds</h1>
              <p className="text-sm text-muted-foreground">
                Manage your RSS feed sources
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/20 hover:bg-white/5"
                title="Refresh feeds"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feed
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl border border-white/10 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    URL
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Articles
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Last Updated
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading RSS feeds...
                      </div>
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="space-y-3">
                        <p className="text-sm text-red-400">
                          {error instanceof Error
                            ? error.message
                            : "Failed to load RSS feeds"}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => refetch()}
                          className="border-white/20 hover:bg-white/5"
                        >
                          Try Again
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && rssFeeds.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      {searchQuery
                        ? "No RSS feeds match your search."
                        : "No RSS feeds have been added yet."}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  rssFeeds.map((feed) => (
                    <tr
                      key={feed.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{feed.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-muted-foreground truncate max-w-xs">
                            {feed.rssUrl}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feed.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {feed.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">-</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(feed.lastFetchedAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/10"
                            onClick={() => handleEditFeed(feed)}
                            disabled={updateFeedMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => handleDeleteFeed(feed)}
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
        onClose={handleCloseModal}
        onSubmit={feedToEdit ? handleUpdateFeed : handleAddFeed}
        feedToEdit={
          feedToEdit
            ? {
                name: feedToEdit.name,
                rssUrl: feedToEdit.rssUrl,
                websiteUrl: feedToEdit.websiteUrl || undefined,
                isActive: feedToEdit.isActive,
                fetchInterval: feedToEdit.fetchInterval,
              }
            : null
        }
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFeedToDelete(null);
        }}
        onConfirm={confirmDeleteFeed}
        title="Delete RSS Feed"
        message={`Are you sure you want to delete ${feedToDelete?.name ?? "this RSS feed"}? This action cannot be undone.`}
        confirmText={deleteFeedMutation.isPending ? "Deleting..." : "Delete"}
        variant="danger"
      />
    </div>
  );
}
