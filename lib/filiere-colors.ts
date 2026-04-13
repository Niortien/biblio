/**
 * Couleurs associées à chaque filière par son code.
 * Chaque entrée expose :
 *   - bg       : fond principal (card sélectionnée, badge)
 *   - text     : texte sur fond coloré
 *   - light    : fond léger (badge non sélectionné)
 *   - lightText: texte sur fond léger
 *   - border   : bordure de survol
 *   - dot      : petite pastille colorée
 */

export interface FiliereColors {
  bg: string;
  text: string;
  light: string;
  lightText: string;
  border: string;
  dot: string;
}

const palette: Record<string, FiliereColors> = {
  MIAGE: {
    bg: "bg-violet-600",
    text: "text-white",
    light: "bg-violet-100",
    lightText: "text-violet-700",
    border: "border-violet-400",
    dot: "bg-violet-500",
  },
  GESTION: {
    bg: "bg-emerald-600",
    text: "text-white",
    light: "bg-emerald-100",
    lightText: "text-emerald-700",
    border: "border-emerald-400",
    dot: "bg-emerald-500",
  },
  ECONOMIE: {
    bg: "bg-amber-500",
    text: "text-white",
    light: "bg-amber-100",
    lightText: "text-amber-700",
    border: "border-amber-400",
    dot: "bg-amber-500",
  },
  Theorie: {
    bg: "bg-sky-600",
    text: "text-white",
    light: "bg-sky-100",
    lightText: "text-sky-700",
    border: "border-sky-400",
    dot: "bg-sky-500",
  },
  SJAP: {
    bg: "bg-rose-600",
    text: "text-white",
    light: "bg-rose-100",
    lightText: "text-rose-700",
    border: "border-rose-400",
    dot: "bg-rose-500",
  },
  "3EA": {
    bg: "bg-orange-500",
    text: "text-white",
    light: "bg-orange-100",
    lightText: "text-orange-700",
    border: "border-orange-400",
    dot: "bg-orange-500",
  },
};

const DEFAULT: FiliereColors = {
  bg: "bg-primary",
  text: "text-primary-foreground",
  light: "bg-primary/10",
  lightText: "text-primary",
  border: "border-primary/40",
  dot: "bg-primary",
};

export function getFiliereColors(code: string): FiliereColors {
  return palette[code] ?? DEFAULT;
}
