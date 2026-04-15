"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { AdminHeader } from "@/components/admin/admin-header";
import { Empty } from "@/components/ui/empty";
import { useCategoryStore } from "@/lib/store/category.store";
import type { Category } from "@/lib/types";
import { toast } from "sonner";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export default function CategoriesPage() {
  const {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    slug: "",
  });

  // 🔥 fetch inicial
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
    });
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : slugify(name),
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Please fill in all required fields");
      return;
    }

    const existingSlug = categories.find(
      (c) => c.slug === formData.slug && c.id !== editingCategory?.id
    );

    if (existingSlug) {
      toast.error("A category with this slug already exists");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Category updated successfully");
      } else {
        await addCategory({
          name: formData.name,
          slug: formData.slug,
        });
        toast.success("Category created successfully");
      }

      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategory(deleteId);
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error("Failed to delete category");
    }

    setDeleteId(null);
  };

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader title="Categories" breadcrumbs={[{ label: "Categories" }]} />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Organize your blog content
            </p>
          </div>

          <Button onClick={handleOpenCreate}>
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* content */}
        {loading ? (
          <div className="text-center text-muted-foreground py-10">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <Empty
            icon={<Tags className="size-12" />}
            title="No categories yet"
            description="Create your first category"
            action={
              <Button onClick={handleOpenCreate}>
                <Plus className="size-4 mr-2" />
                Add Category
              </Button>
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-24 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Tags className="size-4 text-muted-foreground" />
                        {category.name}
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-0.5 rounded">
                        {category.slug}
                      </code>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category details"
                : "Create a new category"}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                placeholder="Category name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input
                placeholder="category-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: slugify(e.target.value),
                  })
                }
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}