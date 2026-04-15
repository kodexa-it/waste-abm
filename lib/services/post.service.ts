import { apiFetch } from "../api/client";
import { Post } from "@/lib/types";

export const postService = {
  getAll: () => apiFetch<Post[]>("/posts"),

  create: (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("excerpt", data.excerpt);
    formData.append("status", data.status);
    formData.append("categoryId", data.categoryId);

    // 🔥 BLOQUES
    const blockFiles: File[] = [];

    const cleanContent = data.content.map((block: any) => {
      if (block.type === "image" && block.file instanceof File) {
        const index = blockFiles.length;
        blockFiles.push(block.file);

        return {
          ...block,
          url: `__file_${index}`, // 👈 clave
        };
      }

      return block;
    });

    formData.append("content", JSON.stringify(cleanContent));

    // 🔥 enviar archivos de bloques
    blockFiles.forEach((file) => {
      formData.append("contentFiles", file);
    });

    if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
    if (data.metaDescription)
      formData.append("metaDescription", data.metaDescription);

    if (data.file) {
      formData.append("file", data.file); // featured
    }

    return apiFetch<Post>("/posts", {
      method: "POST",
      body: formData,
    });
  },

  update: (id: string, data: any) => {
    const formData = new FormData();

    if (data.title) formData.append("title", data.title);
    if (data.excerpt) formData.append("excerpt", data.excerpt);
    if (data.status) formData.append("status", data.status);
    if (data.categoryId) formData.append("categoryId", data.categoryId);

    const blockFiles: File[] = [];

    if (data.content) {
      const cleanContent = data.content.map((block: any) => {
        if (block.type === "image" && block.file instanceof File) {
          const index = blockFiles.length;
          blockFiles.push(block.file);

          return {
            ...block,
            url: `__file_${index}`,
          };
        }

        return block;
      });

      formData.append("content", JSON.stringify(cleanContent));
    }

    blockFiles.forEach((file) => {
      formData.append("contentFiles", file);
    });

    if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
    if (data.metaDescription)
      formData.append("metaDescription", data.metaDescription);

    if (data.file instanceof File) {
      formData.append("file", data.file);
    }

    return apiFetch<Post>(`/posts/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: string) =>
    apiFetch<void>(`/posts/${id}`, {
      method: "DELETE",
    }),
};