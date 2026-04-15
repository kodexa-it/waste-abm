"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Search,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { AdminHeader } from "@/components/admin/admin-header";
import { Empty } from "@/components/ui/empty";

import { usePostStore } from "@/lib/store/post.store";
import { useCategoryStore } from "@/lib/store/category.store";

import { toast } from "sonner";

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-AR");
}

export default function PostsPage() {
  const { posts, fetchPosts, deletePost } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    );

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((c) => c.id === categoryId)?.name ||
      "Uncategorized"
    );
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePost(deleteId);
      toast.success("Post deleted successfully");
    } catch {
      toast.error("Error deleting post");
    }

    setDeleteId(null);
  };

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader title="Blog Posts" />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your content
            </p>
          </div>

          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 size-4" />
              New Post
            </Link>
          </Button>
        </div>

        {/* filters */}
        <div className="flex gap-3">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40">
              <Filter className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">
                Published
              </SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* table */}
        {posts.length === 0 ? (
          <Empty
            icon={<FileText className="size-12" />}
            title="No posts yet"
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link href={`/admin/posts/${post.id}`}>
                        {post.title}
                      </Link>
                    </TableCell>

                    <TableCell>
                      {getCategoryName(post.categoryId)}
                    </TableCell>

                    <TableCell>
                      <Badge>{post.status}</Badge>
                    </TableCell>

                    <TableCell>
                      {formatDate(post.updatedAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/posts/${post.id}`}>
                          <Pencil className="size-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* delete modal */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}