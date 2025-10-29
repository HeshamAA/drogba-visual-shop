import axios from "axios";

export type Role = {
  name: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  role?: Role;
};

const RAW_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";

export const authApi = {
  async login({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) {
    // Strapi Admin login endpoint
    const url = RAW_BASE_URL.replace(/\/$/, "") + "/admin/login";
    const { data } = await axios.post(url, { email: identifier, password });
    // Normalize to { jwt, user }
    return {
      jwt: data?.data?.token ?? data?.token ?? "",
      user: (data?.data?.user ?? data?.user) as User,
    };
  },

  async getMe(token: string): Promise<User> {
    const url = RAW_BASE_URL.replace(/\/$/, "") + "/admin/users/me";
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Strapi may return { data: {...} } or the object directly
    return (data?.data ?? data) as User;
  },
};
