import { apiFetch } from "../api/client";
import { Partner } from "@/lib/types";

export const partnerService = {
  getAll: () => apiFetch<Partner[]>("/partners"),

  create: (data: {
    name: string;
    website: string;
    logo: File;
    order?: number;
  }) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("website", data.website);

    if (data.order !== undefined) {
      formData.append("order", String(data.order));
    }

    formData.append("file", data.logo);

    return apiFetch<Partner>("/partners", {
      method: "POST",
      body: formData,
    });
  },

  update: (
    id: string,
    data: {
      name?: string;
      website?: string;
      logo?: File;
      order?: number;
    },
  ) => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.website) formData.append("website", data.website);

    if (data.order !== undefined) {
      formData.append("order", String(data.order));
    }

    if (data.logo instanceof File) {
      formData.append("file", data.logo);
    }

    // 🔥 FIX CLAVE: tipar el response
    return apiFetch<Partner>(`/partners/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: string) =>
    apiFetch<void>(`/partners/${id}`, {
      method: "DELETE",
    }),
};