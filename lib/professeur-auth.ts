"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useProfesseurAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("professeur_token");
    if (!token) {
      router.replace("/espace-professeur/login");
    }
  }, [router]);
}

export function getProfesseurUser(): {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
} | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("professeur_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  const token = localStorage.getItem("professeur_token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function logoutProfesseur() {
  localStorage.removeItem("professeur_token");
  localStorage.removeItem("professeur_refresh_token");
  localStorage.removeItem("professeur_user");
}
