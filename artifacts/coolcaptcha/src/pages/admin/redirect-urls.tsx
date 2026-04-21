import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";
import { createRedirectUrl, deleteRedirectUrl, getRedirectUrls, updateRedirectUrl } from "@/lib/redirect-urls-api";
import type { RedirectUrl, CreateRedirectUrlInput, UpdateRedirectUrlInput } from "@/lib/redirect-urls-api";
import { useToast } from "@/hooks/use-toast";

const redirectUrlsQueryKey = ["redirectUrls"] as const;

export default function RedirectUrls() {
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [redirectUrlToDelete, setRedirectUrlToDelete] = useState<RedirectUrl | null>(null);
  const [redirectUrlToEdit, setRedirectUrlToEdit] = useState<RedirectUrl | null>(null);

  const {
    data: redirectUrls = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: redirectUrlsQueryKey,
    queryFn: () => getRedirectUrls(),
  });

  const filteredRedirectUrls = redirectUrls.filter(
    (url: RedirectUrl) =>
      url.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.redirectUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteRedirectUrlMutation = useMutation({
    mutationFn: (id: string) => deleteRedirectUrl(id),
    onSuccess: async () => {
      await refetch();
      setIsDeleteModalOpen(false);
      setRedirectUrlToDelete(null);
      toast({
        title: "Redirect URL deleted",
        description: "The redirect URL has been removed.",
      });
    },
  });

  const createRedirectUrlMutation = useMutation({
    mutationFn: (input: CreateRedirectUrlInput) => createRedirectUrl(input),
    onSuccess: async () => {
      await refetch();
      setIsModalOpen(false);
      toast({
        title: "Redirect URL created",
        description: "The redirect URL has been added successfully.",
      });
    },
  });

  const updateRedirectUrlMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRedirectUrlInput }) =>
      updateRedirectUrl(id, input),
    onSuccess: async () => {
      await refetch();
      setIsModalOpen(false);
      setRedirectUrlToEdit(null);
      toast({
        title: "Redirect URL updated",
        description: "The redirect URL has been updated successfully.",
      });
    },
  });

  const handleDeleteRedirectUrl = (redirectUrl: RedirectUrl) => {
    setRedirectUrlToDelete(redirectUrl);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRedirectUrl = async () => {
    if (redirectUrlToDelete) {
      await deleteRedirectUrlMutation.mutateAsync(redirectUrlToDelete.id);
    }
  };

  const handleEditRedirectUrl = (redirectUrl: RedirectUrl) => {
    setRedirectUrlToEdit(redirectUrl);
    setIsModalOpen(true);
  };

  const handleCreateRedirectUrl = () => {
    setRedirectUrlToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="flex-1 ml-64">
        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Redirect URLs</h1>
              <p className="text-muted-foreground">Manage redirect URLs for captcha verification</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/20 hover:bg-white/5"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={handleCreateRedirectUrl} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Redirect URL
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Redirect URL</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Created At</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                      </td>
                    </tr>
                  )}

                  {isError && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-red-400">
                        Error loading redirect URLs: {error instanceof Error ? error.message : "Unknown error"}
                      </td>
                    </tr>
                  )}

                  {!isLoading && !isError && filteredRedirectUrls.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                        {searchQuery ? "No redirect URLs match your search." : "No redirect URLs have been added yet."}
                      </td>
                    </tr>
                  )}

                  {!isLoading && !isError && filteredRedirectUrls.map((redirectUrl: RedirectUrl) => (
                    <tr key={redirectUrl.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{redirectUrl.name || "-"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">{redirectUrl.redirectUrl}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            redirectUrl.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {redirectUrl.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(redirectUrl.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/10"
                            onClick={() => handleEditRedirectUrl(redirectUrl)}
                            disabled={updateRedirectUrlMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => handleDeleteRedirectUrl(redirectUrl)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRedirectUrlToDelete(null);
        }}
        onConfirm={confirmDeleteRedirectUrl}
        title="Delete Redirect URL"
        message={`Are you sure you want to delete "${redirectUrlToDelete?.name || redirectUrlToDelete?.redirectUrl}"? This action cannot be undone.`}
      />

      <CreateRedirectUrlModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRedirectUrlToEdit(null);
        }}
        redirectUrlToEdit={redirectUrlToEdit}
        onCreate={(input) => createRedirectUrlMutation.mutate(input)}
        onUpdate={(id, input) => updateRedirectUrlMutation.mutate({ id, input })}
      />
    </div>
  );
}

// ===================== CREATE/EDIT MODAL =====================

interface CreateRedirectUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrlToEdit: RedirectUrl | null;
  onCreate: (input: CreateRedirectUrlInput) => void;
  onUpdate: (id: string, input: UpdateRedirectUrlInput) => void;
}

function CreateRedirectUrlModal({
  isOpen,
  onClose,
  redirectUrlToEdit,
  onCreate,
  onUpdate,
}: CreateRedirectUrlModalProps) {
  const [name, setName] = useState(redirectUrlToEdit?.name || "");
  const [redirectUrl, setRedirectUrlValue] = useState(redirectUrlToEdit?.redirectUrl || "");
  const [isActive, setIsActive] = useState(redirectUrlToEdit?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirectUrl) return;

    setIsLoading(true);
    try {
      if (redirectUrlToEdit) {
        await onUpdate(redirectUrlToEdit.id, { name: name || undefined, redirectUrl, isActive });
      } else {
        await onCreate({ name: name || undefined, redirectUrl, isActive });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setRedirectUrlValue("");
    setIsActive(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6">
          {redirectUrlToEdit ? "Edit Redirect URL" : "Add Redirect URL"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Google, Facebook"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Redirect URL *</label>
            <input
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrlValue(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-2.5 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/50"
            />
            <label htmlFor="isActive" className="text-sm">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-white/20 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !redirectUrl}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : redirectUrlToEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
