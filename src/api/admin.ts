import axios from "axios";
import {
  adminProductsApi as coreAdminProductsApi,
  getImageUrl as coreGetImageUrl,
} from "@/api/strapi";

const RAW_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";

export const adminProductsApi = {
  ...coreAdminProductsApi,
  async uploadImage(file: File): Promise<{ id: number; url: string }> {
    const form = new FormData();
    form.append("files", file);
    const url = RAW_BASE_URL.replace(/\/$/, "") + "/upload";
    const { data } = await axios.post(url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const uploaded = Array.isArray(data) ? data[0] : data;
    return { id: uploaded?.id, url: uploaded?.url };
  },
};

export const getImageUrl = coreGetImageUrl;
