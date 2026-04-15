import { create } from "zustand";
import { Banner } from "@/lib/types";
import { bannerService } from "@/lib/services/banner.service";

type CreateBannerPayload = {
  type: "image" | "video";
  isActive: boolean;
  desktop?: File;
  mobile?: File;
};

type UpdateBannerPayload = {
  type?: "image" | "video";
  isActive?: boolean;
  desktop?: File;
  mobile?: File;
};

type BannerPayload = {
  type?: "image" | "video";
  isActive?: boolean;
  desktop?: File;
  mobile?: File;
};

interface BannerState {
  banners: Banner[];
  loading: boolean;

  fetchBanners: () => Promise<void>;
  createBanner: (data: CreateBannerPayload) => Promise<void>;
  updateBanner: (id: string, data: UpdateBannerPayload) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  setActiveBanner: (id: string) => Promise<void>;
}

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  loading: false,

  fetchBanners: async () => {
    set({ loading: true });
    const data = await bannerService.getAll();
    set({ banners: data, loading: false });
  },

  createBanner: async (data) => {
    const newBanner = await bannerService.create(data);
    set({ banners: [...get().banners, newBanner] });
  },

  updateBanner: async (id, data) => {
    const updated = await bannerService.update(id, data);
    set({
      banners: get().banners.map((b) => (b.id === id ? updated : b)),
    });
  },

  deleteBanner: async (id) => {
    await bannerService.delete(id);
    set({
      banners: get().banners.filter((b) => b.id !== id),
    });
  },

  setActiveBanner: async (id) => {
    await bannerService.setActive(id);

    set({
      banners: get().banners.map((b) => ({
        ...b,
        active: b.id === id,
      })),
    });
  },
}));
