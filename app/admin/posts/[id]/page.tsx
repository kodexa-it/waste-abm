"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AdminHeader } from "@/components/admin/admin-header";
import { BlockEditor } from "@/components/admin/block-editor";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Spinner } from "@/components/ui/spinner";

import { usePostStore } from "@/lib/store/post.store";
import { useCategoryStore } from "@/lib/store/category.store";

import type { Post, Block } from "@/lib/types";
import { toast } from "sonner";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export default function PostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { posts, fetchPosts, createPost, updatePost } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();

  const isNew = id === "new";
  const existingPost = posts.find((p) => p.id === id);

  const [isSaving, setIsSaving] = useState(false);

  // 🔥 FILE REAL
  const [featuredFile, setFeaturedFile] = useState<File | undefined>();

  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    excerpt: "",
    content: [],
    categoryId: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
  });

  // 🔥 fetch inicial
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // 🔥 cargar datos en edit
  useEffect(() => {
    if (!isNew && existingPost) {
      setFormData(existingPost);
    }
  }, [existingPost, isNew]);

  const generatedSlug = slugify(formData.title || "");

  const handleContentChange = (content: Block[]) => {
    setFormData({ ...formData, content });
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        await createPost({
          title: formData.title!,
          excerpt: formData.excerpt || "",
          status: formData.status!,
          categoryId: formData.categoryId!,
          content: formData.content || [],
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          file: featuredFile,
        });

        toast.success("Post created");
        router.push("/admin/posts");
      } else {
        await updatePost(id, {
          title: formData.title,
          excerpt: formData.excerpt,
          status: formData.status,
          categoryId: formData.categoryId,
          content: formData.content,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          file: featuredFile,
        });

        toast.success("Post updated");
        router.push("/admin/posts");
      }
    } catch (err) {
      toast.error("Error saving post");
    }

    setIsSaving(false);
  };

  if (!isNew && !existingPost) {
    return <div className="p-10">Post not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader title={isNew ? "New Post" : "Edit Post"} />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* EDITOR */}
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between">
              <Button variant="ghost" asChild>
                <Link href="/admin/posts">
                  <ArrowLeft className="mr-2 size-4" />
                  Back
                </Link>
              </Button>

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save
                  </>
                )}
              </Button>
            </div>

            <Input
              placeholder="Post title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-3xl font-bold border-0 bg-transparent"
            />

            <code>/blog/{generatedSlug}</code>

            <Separator />

            <BlockEditor
              blocks={(formData.content || []) as Block[]}
              onChange={handleContentChange}
            />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-80 border-l p-4">
          <Tabs defaultValue="settings">
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <FieldGroup>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        status: v as "draft" | "published",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">
                        Published
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, categoryId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Excerpt</FieldLabel>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excerpt: e.target.value,
                      })
                    }
                  />
                </Field>

                {/* 🔥 MEDIA FIX */}
                <Field>
                  <FieldLabel>Featured Image</FieldLabel>
                  <MediaUploader
                    value={formData.featuredImage}
                    onChange={(url, file) => {
                      setFormData({
                        ...formData,
                        featuredImage: url,
                      });
                      setFeaturedFile(file);
                    }}
                    accept="image/*"
                  />
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="seo">
              <FieldGroup>
                <Field>
                  <FieldLabel>Meta Title</FieldLabel>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaTitle: e.target.value,
                      })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Meta Description</FieldLabel>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                  />
                </Field>
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}