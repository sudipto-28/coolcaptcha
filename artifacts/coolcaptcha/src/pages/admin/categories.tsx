import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MoreVertical, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CreateCategoryModal } from "@/components/admin/create-category-modal";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/lib/categories-api";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/lib/categories-api";
import { useToast } from "@/hooks/use-toast";

const categoriesQueryKey = ["categories"] as const;

export default function Categories() {
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Category added",
        description: "The new category is ready to use.",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Category deleted",
        description: "The category has been removed.",
      });
    },
    onError: (deleteError) => {
      toast({
        title: "Could not delete category",
        description: deleteError instanceof Error ? deleteError.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => updateCategory(id, data),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (updateError) => {
      toast({
        title: "Could not update category",
        description: updateError instanceof Error ? updateError.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddCategory = async (data: CreateCategoryInput) => {
    await createCategoryMutation.mutateAsync(data);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleUpdateCategory = async (data: CreateCategoryInput) => {
    if (categoryToEdit) {
      await updateCategoryMutation.mutateAsync({ id: categoryToEdit.id, data });
      setCategoryToEdit(null);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/20 hover:bg-white/5"
                title="Refresh categories"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Slug</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading categories...
                      </div>
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="space-y-3">
                        <p className="text-sm text-red-400">
                          {error instanceof Error ? error.message : "Failed to load categories"}
                        </p>
                        <Button variant="outline" onClick={() => refetch()} className="border-white/20 hover:bg-white/5">
                          Try Again
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No categories have been added yet.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && categories.map((category: Category) => (
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
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.isFilterable
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {category.isFilterable ? "Filterable" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10"
                          onClick={() => handleEditCategory(category)}
                          disabled={updateCategoryMutation.isPending}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDeleteCategory(category)}
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
        onClose={handleCloseModal}
        onSubmit={categoryToEdit ? handleUpdateCategory : handleAddCategory}
        categoryToEdit={categoryToEdit ? { name: categoryToEdit.name, description: categoryToEdit.description || "" } : null}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete ${categoryToDelete?.name ?? "this category"}? This action cannot be undone.`}
        confirmText={deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
        variant="danger"
      />
    </div>
  );
}
