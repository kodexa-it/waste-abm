import { create } from "zustand"
import { Category } from "@/lib/types"
import { categoryService } from "@/lib/services/category.service"

interface CategoryState {
  categories: Category[]
  loading: boolean

  fetchCategories: () => Promise<void>
  addCategory: (data: { name: string; slug: string }) => Promise<void>
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true })
    const data = await categoryService.getAll()
    set({ categories: data, loading: false })
  },

  addCategory: async (data) => {
    const newCategory = await categoryService.create(data)
    set({ categories: [...get().categories, newCategory] })
  },

  updateCategory: async (id, data) => {
    const updated = await categoryService.update(id, data)

    set({
      categories: get().categories.map((c) =>
        c.id === id ? updated : c
      ),
    })
  },

  deleteCategory: async (id) => {
    await categoryService.delete(id)

    set({
      categories: get().categories.filter((c) => c.id !== id),
    })
  },
}))