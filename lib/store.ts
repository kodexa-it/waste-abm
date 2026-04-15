import { create } from "zustand";
import type {
  Banner,
  Partner,
  Certificate,
  Category,
  Post,
  User,
  Block,
} from "./types";

// Generate unique IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);
import { authService } from "./services/auth.service";

// Mock user
const mockUser: User = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
};

// Mock data
const mockBanners: Banner[] = [
  {
    id: "1",
    type: "image",
    desktopUrl: "/api/placeholder/1920/600",
    mobileUrl: "/api/placeholder/768/500",
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    type: "video",
    desktopUrl: "/api/placeholder/1920/600",
    mobileUrl: "/api/placeholder/768/500",
    active: false,
    createdAt: "2024-01-10",
  },
];

const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Acme Corp",
    website: "https://acme.com",
    logoUrl: "/api/placeholder/200/100",
    order: 1,
  },
  {
    id: "2",
    name: "TechStart",
    website: "https://techstart.io",
    logoUrl: "/api/placeholder/200/100",
    order: 2,
  },
  {
    id: "3",
    name: "Innovate Inc",
    website: "https://innovate.com",
    logoUrl: "/api/placeholder/200/100",
    order: 3,
  },
];

const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "ISO 9001 Certification",
    description: "Quality management certification",
    issueDate: "2024-01-01",
    fileUrl: "/certificate.pdf",
    fileType: "pdf",
  },
  {
    id: "2",
    title: "Industry Award 2023",
    description: "Best in category award",
    issueDate: "2023-12-15",
    fileUrl: "/award.jpg",
    fileType: "image",
  },
];

const mockCategories: Category[] = [
  { id: "1", name: "Technology", slug: "technology" },
  { id: "2", name: "Business", slug: "business" },
  { id: "3", name: "Design", slug: "design" },
];

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Our Platform",
    slug: "getting-started",
    excerpt:
      "Learn how to get started with our platform in just a few simple steps.",
    content: [
      {
        id: "b1",
        type: "paragraph",
        text: "Welcome to our comprehensive guide on getting started with our platform.",
      },
      { id: "b2", type: "heading", level: 2, text: "First Steps" },
      {
        id: "b3",
        type: "paragraph",
        text: "Before diving in, make sure you have completed the initial setup process.",
      },
    ],
    categoryId: "1",
    status: "published",
    featuredImage: "/api/placeholder/800/400",
    metaTitle: "Getting Started - Platform Guide",
    metaDescription:
      "A comprehensive guide to getting started with our platform.",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Best Practices for Content Creation",
    slug: "content-creation-best-practices",
    excerpt: "Discover the best practices for creating engaging content.",
    content: [
      {
        id: "b4",
        type: "paragraph",
        text: "Creating great content requires understanding your audience.",
      },
    ],
    categoryId: "2",
    status: "draft",
    featuredImage: "/api/placeholder/800/400",
    metaTitle: "",
    metaDescription: "",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-19",
  },
  {
    id: "3",
    title: "Design Principles for Modern Websites",
    slug: "design-principles",
    excerpt:
      "Explore the fundamental design principles that make websites stand out.",
    content: [
      { id: "b5", type: "heading", level: 1, text: "Modern Design Principles" },
      {
        id: "b6",
        type: "paragraph",
        text: "Good design is all about balance, hierarchy, and clarity.",
      },
      {
        id: "b7",
        type: "infobox",
        variant: "info",
        text: "Tip: Always prioritize user experience over aesthetics.",
      },
    ],
    categoryId: "3",
    status: "published",
    featuredImage: "/api/placeholder/800/400",
    metaTitle: "Design Principles for Modern Websites",
    metaDescription:
      "Learn the essential design principles for creating modern, user-friendly websites.",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
  },
];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
}

interface CMSState {
  // Banners
  banners: Banner[];
  addBanner: (banner: Omit<Banner, "id" | "createdAt">) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  setActiveBanner: (id: string) => void;

  // Partners
  partners: Partner[];
  addPartner: (partner: Omit<Partner, "id">) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  reorderPartners: (partners: Partner[]) => void;

  // Certificates
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, "id">) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Posts
  posts: Post[];
  addPost: (post: Omit<Post, "id" | "createdAt" | "updatedAt">) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

  initAuth: () => {
    const token = localStorage.getItem('token')

    if (token) {
      set({
        token,
        isAuthenticated: true,
      })
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true });

      const data = await authService.login(email, password);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

      return true;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export const useCMSStore = create<CMSState>((set) => ({
  banners: mockBanners,
  partners: mockPartners,
  certificates: mockCertificates,
  categories: mockCategories,
  posts: mockPosts,

  // Banner methods
  addBanner: (banner) =>
    set((state) => ({
      banners: [
        ...state.banners,
        {
          ...banner,
          id: generateId(),
          createdAt: new Date().toISOString().split("T")[0],
        },
      ],
    })),
  updateBanner: (id, banner) =>
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === id ? { ...b, ...banner } : b,
      ),
    })),
  deleteBanner: (id) =>
    set((state) => ({
      banners: state.banners.filter((b) => b.id !== id),
    })),
  setActiveBanner: (id) =>
    set((state) => ({
      banners: state.banners.map((b) => ({ ...b, active: b.id === id })),
    })),

  // Partner methods
  addPartner: (partner) =>
    set((state) => ({
      partners: [...state.partners, { ...partner, id: generateId() }],
    })),
  updatePartner: (id, partner) =>
    set((state) => ({
      partners: state.partners.map((p) =>
        p.id === id ? { ...p, ...partner } : p,
      ),
    })),
  deletePartner: (id) =>
    set((state) => ({
      partners: state.partners.filter((p) => p.id !== id),
    })),
  reorderPartners: (partners) => set({ partners }),

  // Certificate methods
  addCertificate: (certificate) =>
    set((state) => ({
      certificates: [
        ...state.certificates,
        { ...certificate, id: generateId() },
      ],
    })),
  updateCertificate: (id, certificate) =>
    set((state) => ({
      certificates: state.certificates.map((c) =>
        c.id === id ? { ...c, ...certificate } : c,
      ),
    })),
  deleteCertificate: (id) =>
    set((state) => ({
      certificates: state.certificates.filter((c) => c.id !== id),
    })),

  // Category methods
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, { ...category, id: generateId() }],
    })),
  updateCategory: (id, category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...category } : c,
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  // Post methods
  addPost: (post) =>
    set((state) => ({
      posts: [
        ...state.posts,
        {
          ...post,
          id: generateId(),
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        },
      ],
    })),
  updatePost: (id, post) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id
          ? { ...p, ...post, updatedAt: new Date().toISOString().split("T")[0] }
          : p,
      ),
    })),
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),
}));