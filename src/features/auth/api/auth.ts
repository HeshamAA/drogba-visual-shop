import axiosInstance from "@/lib/api/client";

export type Role = {
  name: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  role?: Role;
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

export const authApi = {
  // 🔹 Login endpoint (Strapi Users & Permissions)
  async login({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) {
    const { data } = await axiosInstance.post("/auth/local", { identifier, password });

    // Strapi returns { jwt, user }
    return {
      jwt: data.jwt,
      user: data.user as User,
    };
  },

  // 🔹 Get currently authenticated user
  async getMe(token: string): Promise<User> {
    const { data } = await axiosInstance.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      params: { populate: "*" },
    });
    return data as User;
  },
};
