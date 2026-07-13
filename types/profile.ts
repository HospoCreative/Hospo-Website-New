export type AdminRole = "admin" | "editor";

export type Profile = {
  id: string;
  email: string;
  fullName?: string | null;
  role: AdminRole;
  createdAt?: string;
  updatedAt?: string;
};
