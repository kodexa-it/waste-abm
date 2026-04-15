import { create } from "zustand";
import { Post } from "@/lib/types";
import { postService } from "@/lib/services/post.service";

interface PostState {
  posts: Post[];
  loading: boolean;

  fetchPosts: () => Promise<void>;
  createPost: (data: any) => Promise<void>;
  updatePost: (id: string, data: any) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: false,

  fetchPosts: async () => {
    set({ loading: true });
    const data = await postService.getAll();
    set({ posts: data, loading: false });
  },

  createPost: async (data) => {
    const newPost = await postService.create(data);
    set({ posts: [...get().posts, newPost] });
  },

  updatePost: async (id, data) => {
    const updated = await postService.update(id, data);

    set({
      posts: get().posts.map((p) =>
        p.id === id ? updated : p
      ),
    });
  },

  deletePost: async (id) => {
    await postService.delete(id);

    set({
      posts: get().posts.filter((p) => p.id !== id),
    });
  },
}));