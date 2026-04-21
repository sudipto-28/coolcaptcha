import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";
import { CreateArticleModal } from "@/components/admin/create-article-modal";
import {
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} from "@/lib/articles-api";
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/lib/articles-api";
import { useToast } from "@/hooks/use-toast";

const articlesQueryKey = ["articles"] as const;

export default function AdminArticles() {
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [rssFetchLoading, setRssFetchLoading] = useState(false);
  const [rssFetchMessage, setRssFetchMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [...articlesQueryKey, currentPage, itemsPerPage],
    queryFn: () => getArticles({ page: currentPage, limit: itemsPerPage }),
  });

  const articles = apiResponse?.data || [];
  const pagination = apiResponse?.metadata;

  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Article deleted",
        description: "The article has been removed.",
      });
    },
    onError: (deleteError) => {
      toast({
        title: "Could not delete article",
        description:
          deleteError instanceof Error
            ? deleteError.message
            : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: (data: CreateArticleInput) => createArticle(data),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Article created",
        description: "The new article is ready to use.",
      });
    },
    onError: (createError) => {
      toast({
        title: "Could not create article",
        description:
          createError instanceof Error
            ? createError.message
            : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleInput }) =>
      updateArticle(id, data),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Article updated",
        description: "The article has been updated successfully.",
      });
    },
    onError: (updateError) => {
      toast({
        title: "Could not update article",
        description:
          updateError instanceof Error
            ? updateError.message
            : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredArticles = articles.filter(
    (article: Article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.category?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Use API pagination metadata
  const totalPages = pagination?.totalPages || 1;

  const handleDeleteArticle = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (articleToDelete) {
      await deleteArticleMutation.mutateAsync(articleToDelete.id);
      setArticleToDelete(null);
    }
  };

  const handleAddArticle = async (data: CreateArticleInput) => {
    await createArticleMutation.mutateAsync(data);
  };

  const handleEditArticle = (article: Article) => {
    setArticleToEdit(article);
    setIsModalOpen(true);
  };

  const handleUpdateArticle = async (data: CreateArticleInput) => {
    if (articleToEdit) {
      await updateArticleMutation.mutateAsync({ id: articleToEdit.id, data });
      setArticleToEdit(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setArticleToEdit(null);
  };

  const handleFetchRssFeeds = async () => {
    setRssFetchLoading(true);
    setRssFetchMessage(null);

    try {
      const response = await fetch("/api/feeds/fetch-all", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setRssFetchMessage(data.message || "RSS feeds fetched successfully!");
        await refetch(); // Refresh articles after fetch
      } else {
        setRssFetchMessage("Failed to fetch RSS feeds");
      }
    } catch (error) {
      console.error("Error fetching RSS feeds:", error);
      setRssFetchMessage("Error fetching RSS feeds");
    } finally {
      setRssFetchLoading(false);
    }
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
              <h1 className="text-2xl font-bold">Articles</h1>
              <p className="text-sm text-muted-foreground">
                Manage your article content
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/20 hover:bg-white/5"
                title="Refresh articles"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                onClick={handleFetchRssFeeds}
                disabled={rssFetchLoading}
                className="border-white/20 hover:bg-white/5"
                title="Fetch RSS feeds"
              >
                {rssFetchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refetch Feeds
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Article
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* RSS Fetch Feedback */}
          {rssFetchMessage && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                rssFetchMessage.includes("success") ||
                rssFetchMessage.includes("saved")
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <p className="text-sm">{rssFetchMessage}</p>
            </div>
          )}

          {/* Search */}
          {/* <div className="mb-6">
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
          </div> */}

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
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Published
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
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading articles...
                      </div>
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="space-y-3">
                        <p className="text-sm text-red-400">
                          {error instanceof Error
                            ? error.message
                            : "Failed to load articles"}
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

                {!isLoading && !isError && filteredArticles.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      {searchQuery
                        ? "No articles match your search."
                        : "No articles have been added yet."}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  filteredArticles.map((article: Article) => (
                    <tr
                      key={article.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium max-w-md">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {article.category?.name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === "PUBLISHED"
                              ? "bg-green-500/10 text-green-400"
                              : article.status === "DRAFT"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10"
                          onClick={() => handleEditArticle(article)}
                          disabled={updateArticleMutation.isPending}
                        >
                          <Edit className="w-4 h-4" />
                        </Button> */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => handleDeleteArticle(article)}
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

          {/* Pagination Controls */}
          {pagination && pagination.total > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min(
                    (pagination.page - 1) * pagination.limit + 1,
                    pagination.total
                  )}{" "}
                  to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} articles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPreviousPage}
                  className="border-white/20 hover:bg-white/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(pagination.totalPages, p + 1)
                    )
                  }
                  disabled={!pagination.hasNextPage}
                  className="border-white/20 hover:bg-white/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setArticleToDelete(null);
        }}
        onConfirm={confirmDeleteArticle}
        title="Delete Article"
        message={`Are you sure you want to delete "${articleToDelete?.title ?? "this article"}"? This action cannot be undone.`}
        confirmText={deleteArticleMutation.isPending ? "Deleting..." : "Delete"}
        variant="danger"
      />

      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={articleToEdit ? handleUpdateArticle : handleAddArticle}
        articleToEdit={
          articleToEdit
            ? {
                authorId: articleToEdit.authorId,
                title: articleToEdit.title,
                excerpt: articleToEdit.excerpt || undefined,
                content: articleToEdit.content || undefined,
                status: articleToEdit.status,
                categoryId: articleToEdit.categoryId || undefined,
                sourceId: articleToEdit.sourceId || undefined,
              }
            : null
        }
      />
    </div>
  );
}
