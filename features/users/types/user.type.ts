export type UserRole = "etudiant" | "admin" | "professeur";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  etudiant: "Étudiant",
  admin: "Admin",
  professeur: "Professeur",
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  filiereId?: string;
  niveauId?: string;
  imageUrl?: string;
  filiere?: { id: string; name: string; code: string } | null;
  niveau?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAddDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  filiereId?: string;
  niveauId?: string;
  imageUrl?: string;
}

export interface UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  filiereId?: string;
  niveauId?: string;
  imageUrl?: string;
}
