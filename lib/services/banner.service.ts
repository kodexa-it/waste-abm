// lib/services/banner.service.ts

import { apiFetch } from "../api/client";
import { Banner } from "@/lib/types";

export const bannerService = {
  getAll: () => apiFetch<Banner[]>("/banners"),

  create: (data: {
    type: "image" | "video";
    isActive: boolean;
    desktop?: File;
    mobile?: File;
  }) => {
    const formData = new FormData();

    formData.append("type", data.type);
    formData.append("isActive", String(data.isActive));

    if (data.desktop) {
      formData.append("desktop", data.desktop);
    }

    if (data.mobile) {
      formData.append("mobile", data.mobile);
    }

    return apiFetch<Banner>("/banners", {
      method: "POST",
      body: formData,
    });
  },

  update: (
    id: string,
    data: {
      type?: "image" | "video";
      isActive?: boolean;
      desktop?: File;
      mobile?: File;
    },
  ) => {
    const formData = new FormData();

    if (data.type) {
      formData.append("type", data.type);
    }

    if (data.isActive !== undefined) {
      formData.append("isActive", String(data.isActive));
    }

    if (data.desktop) {
      formData.append("desktop", data.desktop);
    }

    if (data.mobile) {
      formData.append("mobile", data.mobile);
    }

    return apiFetch<Banner>(`/banners/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: string) =>
    apiFetch<void>(`/banners/${id}`, {
      method: "DELETE",
    }),

  setActive: (id: string) =>
    apiFetch<void>(`/banners/${id}/active`, {
      method: "PATCH",
    }),
};
