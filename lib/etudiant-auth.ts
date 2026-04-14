"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useEtudiantAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("etudiant_token");
    if (!token) {
      router.replace("/espace-etudiant/login");
    }
  }, [router]);
}

export function getEtudiantUser(): { id: string; email: string; firstName: string; lastName: string; role: string; filiereId?: string; niveauId?: string } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("etudiant_user");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  // Fallback: decode JWT
  const token = localStorage.getItem("etudiant_token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function logoutEtudiant() {
  localStorage.removeItem("etudiant_token");
  localStorage.removeItem("etudiant_refresh_token");
  localStorage.removeItem("etudiant_user");
}
