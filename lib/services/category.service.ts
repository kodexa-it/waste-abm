import { apiFetch } from "../api/client"
import { Category } from "@/lib/types"

export const categoryService = {
  getAll: () => apiFetch<Category[]>("/categories"),

  create: (data: { name: string; slug: string }) =>
    apiFetch<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Category>) =>
    apiFetch<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/categories/${id}`, {
      method: "DELETE",
    }),
}